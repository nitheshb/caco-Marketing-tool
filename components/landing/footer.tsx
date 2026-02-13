import Link from "next/link";
import { Video } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-black border-t border-white/10" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">
                Footer
            </h2>
            <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-8">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                                <Video className="h-5 w-5" />
                            </div>
                            <span className="text-xl font-bold text-white">VidMaxx</span>
                        </Link>
                        <p className="text-sm leading-6 text-zinc-400">
                            Transforming how creators make and schedule short-form content.
                        </p>
                        <div className="flex space-x-6">
                            {/* Social placeholders */}
                        </div>
                    </div>
                    <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold leading-6 text-white">Product</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    <li>
                                        <a href="#" className="text-sm leading-6 text-zinc-400 hover:text-white">
                                            Features
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-sm leading-6 text-zinc-400 hover:text-white">
                                            Integration
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-sm leading-6 text-zinc-400 hover:text-white">
                                            Pricing
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-sm font-semibold leading-6 text-white">Support</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    <li>
                                        <a href="#" className="text-sm leading-6 text-zinc-400 hover:text-white">
                                            Documentation
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-sm leading-6 text-zinc-400 hover:text-white">
                                            Guides
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-sm leading-6 text-zinc-400 hover:text-white">
                                            API Status
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold leading-6 text-white">Company</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    <li>
                                        <a href="#" className="text-sm leading-6 text-zinc-400 hover:text-white">
                                            About
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-sm leading-6 text-zinc-400 hover:text-white">
                                            Blog
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-sm leading-6 text-zinc-400 hover:text-white">
                                            Careers
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-sm font-semibold leading-6 text-white">Legal</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    <li>
                                        <a href="#" className="text-sm leading-6 text-zinc-400 hover:text-white">
                                            Privacy
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-sm leading-6 text-zinc-400 hover:text-white">
                                            Terms
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
                    <p className="text-xs leading-5 text-zinc-500">
                        &copy; 2024 VidMaxx Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
