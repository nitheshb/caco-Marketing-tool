import axios from "axios";
import { supabaseAdmin } from "./supabase";

/**
 * Upload image using legacy v2 API
 */
async function uploadImageToLinkedIn(
  accessToken: string,
  authorUrn: string,
  imageUrl: string
): Promise<string> {
  console.log("[LinkedIn] Starting v2 image upload...");

  // 1️⃣ Register upload
  const registerResponse = await fetch(
    "https://api.linkedin.com/v2/assets?action=registerUpload",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        registerUploadRequest: {
          owner: authorUrn,
          recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
          serviceRelationships: [
            {
              relationshipType: "OWNER",
              identifier: "urn:li:userGeneratedContent",
            },
          ],
        },
      }),
    }
  );

  if (!registerResponse.ok) {
    const err = await registerResponse.text();
    throw new Error("Image register failed: " + err);
  }

  const registerData = await registerResponse.json();

  const uploadUrl =
    registerData.value.uploadMechanism[
      "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
    ].uploadUrl;

  const asset = registerData.value.asset;

  // 2️⃣ Download image
  const imageResponse = await axios.get(imageUrl, {
    responseType: "arraybuffer",
  });

  // 3️⃣ Upload to LinkedIn
  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": imageResponse.headers["content-type"] || "image/jpeg",
    },
    body: imageResponse.data,
  });

  if (!uploadResponse.ok) {
    const err = await uploadResponse.text();
    throw new Error("Image upload binary failed: " + err);
  }

  console.log("[LinkedIn] Image uploaded successfully.");
  return asset; // THIS is the URN used in post
}

/**
 * Publish post to LinkedIn using stable v2 API
 */
export async function publishToLinkedIn({
  text,
  imageUrl,
  connectionId,
  userId,
}: {
  text: string;
  imageUrl?: string;
  connectionId?: string;
  userId?: string;
}) {
  console.log("[LinkedIn] ===== START publishToLinkedIn =====");

  let query = supabaseAdmin
    .from("social_connections")
    .select("*")
    .eq("platform", "linkedin");

  if (connectionId) query = query.eq("id", connectionId);
  else if (userId) query = query.eq("user_id", userId);
  else throw new Error("Must provide connectionId or userId");

  const { data: connection, error } = await query.single();

  if (error || !connection) {
    throw new Error("LinkedIn connection not found.");
  }

  const accessToken = connection.access_token;
  if (!accessToken) throw new Error("Missing LinkedIn access token.");

  // Build author URN
  const authorUrn = connection.platform_user_id.startsWith("urn:")
    ? connection.platform_user_id
    : `urn:li:person:${connection.platform_user_id}`;

  console.log("[LinkedIn] Author:", authorUrn);

  let assetUrn: string | undefined;

  if (imageUrl) {
    try {
      assetUrn = await uploadImageToLinkedIn(
        accessToken,
        authorUrn,
        imageUrl
      );
    } catch (err) {
      console.warn(
        "[LinkedIn] Image upload failed, falling back to text-only.",
        err
      );
    }
  }

  const postBody = {
    author: authorUrn,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: {
          text,
        },
        shareMediaCategory: assetUrn ? "IMAGE" : "NONE",
        media: assetUrn
          ? [
              {
                status: "READY",
                media: assetUrn,
              },
            ]
          : [],
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };

  console.log("[LinkedIn] Posting via v2 API...");

  const postResponse = await fetch(
    "https://api.linkedin.com/v2/ugcPosts",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(postBody),
    }
  );

  if (!postResponse.ok) {
    const err = await postResponse.text();
    // 422 DUPLICATE_POST = post already exists on LinkedIn (e.g. retry) - treat as success
    if (postResponse.status === 422 && err.includes("DUPLICATE_POST")) {
      const match = err.match(/duplicate of (urn:li:share:\d+)/i);
      const existingId = match?.[1] || "unknown";
      console.log("[LinkedIn] Post already exists (duplicate):", existingId);
      return { success: true, postId: existingId };
    }
    throw new Error(
      `LinkedIn post failed (${postResponse.status}): ${err}`
    );
  }

  const postId = postResponse.headers.get("x-restli-id");

  console.log("[LinkedIn] ✅ Post created:", postId);
  console.log("[LinkedIn] ===== END publishToLinkedIn SUCCESS =====");

  return { success: true, postId };
}