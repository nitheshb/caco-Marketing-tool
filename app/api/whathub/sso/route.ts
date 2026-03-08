import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { getAuthUser } from "@/lib/auth-helpers";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * GET /api/whathub/sso
 *
 * Generates a signed short-lived JWT for the logged-in Agent Elephant user and
 * redirects them to Whathub's /api/auth/caco-sso endpoint, which validates the
 * token, finds or provisions the user, sets auth cookies, and redirects to the
 * Whathub dashboard.
 *
 * The secret in WHATHUB_SSO_SECRET must match [caco_sso].secret in Whathub's config.toml.
 */
export async function GET(req: Request) {
    try {
        const { userId } = await getAuthUser(req);
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Get the user's email from Supabase
        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('email, full_name')
            .eq('id', userId)
            .single();

        if (error || !user?.email) {
            console.error('[Whathub SSO] Could not fetch user email:', error);
            return new NextResponse("User not found", { status: 404 });
        }

        const ssoSecret = process.env.WHATHUB_SSO_SECRET;
        const whathubUrl = (process.env.WHATHUB_URL || 'http://146.190.113.104:8080').replace(/\/$/, '');

        if (!ssoSecret) {
            console.error("[Whathub SSO] WHATHUB_SSO_SECRET is not set — redirecting to Whathub root");
            return NextResponse.redirect(`${whathubUrl}/`);
        }

        // Build a signed JWT (HS256) — this matches what Whathub's CacoSSO handler expects
        const secret = new TextEncoder().encode(ssoSecret);
        const token = await new SignJWT({ email: user.email })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuer('caco-marketing-tool')
            .setIssuedAt()
            .setExpirationTime('5m') // short-lived — valid for 5 minutes
            .sign(secret);

        const loginUrl = `${whathubUrl}/api/auth/caco-sso?token=${token}`;

        console.log(`[Whathub SSO] Redirecting user ${user.email} to Whathub`);
        return NextResponse.redirect(loginUrl);

    } catch (error: any) {
        console.error("[Whathub SSO] Error:", error);
        const whathubUrl = (process.env.WHATHUB_URL || 'http://146.190.113.104:8080').replace(/\/$/, '');
        return NextResponse.redirect(`${whathubUrl}/`);
    }
}
