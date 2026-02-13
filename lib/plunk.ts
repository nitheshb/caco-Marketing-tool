import Plunk from "@plunk/node";

const plunk = new Plunk(process.env.PLUNK_API_KEY!);

export async function sendVideoReadyEmail({
    email,
    title,
    thumbnailUrl,
    videoUrl,
    seriesName
}: {
    email: string;
    title: string;
    thumbnailUrl: string;
    videoUrl: string;
    seriesName: string;
}) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vidmaxx.ai";
    const videoPageUrl = `${appUrl}/dashboard/videos`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            .container { font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a1a; }
            .header { background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); padding: 40px 20px; border-radius: 24px; text-align: center; color: white; }
            .content { padding: 32px 0; }
            .thumbnail { width: 100%; border-radius: 16px; margin: 20px 0; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
            .button-group { display: flex; gap: 12px; justify-content: center; margin-top: 32px; }
            .button { display: inline-block; padding: 14px 28px; border-radius: 12px; font-weight: 600; text-decoration: none; transition: all 0.2s; }
            .primary { background-color: #6366f1; color: white; }
            .secondary { background-color: #f3f4f6; color: #4b5563; }
            .footer { margin-top: 48px; text-align: center; color: #9ca3af; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="margin:0; font-size: 28px;">Your Video is Ready!</h1>
                <p style="margin:10px 0 0; opacity: 0.9;">${seriesName}</p>
            </div>
            
            <div class="content">
                <h2 style="font-size: 20px; margin-bottom: 24px;">Hi there,</h2>
                <p>Exciting news! Your AI-powered video <strong>"${title}"</strong> has been generated and is ready for the spotlight.</p>
                
                <img src="${thumbnailUrl}" alt="Video Thumbnail" class="thumbnail" />
                
                <div style="text-align: center; margin-top: 32px;">
                    <a href="${videoPageUrl}" class="button primary" style="margin-right: 12px;">View Video in Dashboard</a>
                    <a href="${videoUrl}" class="button secondary">Direct Download</a>
                </div>
            </div>
            
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Vidmaxx AI. All rights reserved.</p>
                <p>If you didn't expect this email, you can safely ignore it.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        await plunk.emails.send({
            to: email,
            subject: `✨ Your Vidmaxx video is ready: ${title}`,
            body: html,
        });
        return { success: true };
    } catch (error) {
        console.error("Plunk Email Error:", error);
        return { success: false, error };
    }
}
