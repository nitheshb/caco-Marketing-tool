import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-black">
            {/* Background effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 w-full max-w-md mx-4 flex justify-center">
                <SignIn
                    appearance={{
                        elements: {
                            rootBox: "w-full",
                            card: "rounded-2xl border border-white/10 bg-[#0c0c14] backdrop-blur-xl shadow-2xl",
                            headerTitle: "text-white",
                            headerSubtitle: "text-zinc-400",
                            socialButtonsBlockButton: "text-white border-white/10 hover:bg-white/5",
                            socialButtonsBlockButtonText: "text-white font-medium",
                            dividerLine: "bg-white/10",
                            dividerText: "text-zinc-500",
                            formFieldLabel: "text-white",
                            formFieldInput: "bg-white/5 border-white/10 text-white focus:border-indigo-500",
                            formButtonPrimary: "bg-indigo-600 hover:bg-indigo-500 text-white",
                            footerActionText: "text-zinc-400",
                            footerActionLink: "text-indigo-400 hover:text-indigo-300",
                        }
                    }}
                />
            </div>
        </div>
    );
}
