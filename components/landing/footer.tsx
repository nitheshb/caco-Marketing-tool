import Link from "next/link";
import { Video } from "lucide-react";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="bg-zinc-50 border-t border-black/10" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">
                Footer
            </h2>
            <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-8">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 overflow-hidden">
                                <Image src="/logo.png" alt="Agent Elephant Logo" width={32} height={32} className="object-cover scale-125" />
                            </div>
                            <span className="text-xl font-bold text-zinc-900">Agent Elephant</span>
                        </Link>
                        <p className="text-sm leading-6 text-zinc-600">
                            Transforming how creators make and schedule short-form content.
                        </p>
                        <div className="flex space-x-6">
                            {/* Social placeholders */}
                        </div>
                    </div>
                    <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold leading-6 text-zinc-900">Product</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    <li>
                                        <a href="#" className="text-sm leading-6 text-zinc-600 hover:text-zinc-900">
                                            Features
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-sm leading-6 text-zinc-600 hover:text-zinc-900">
                                            Integration
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-sm leading-6 text-zinc-600 hover:text-zinc-900">
                                            Pricing
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-sm font-semibold leading-6 text-zinc-900">Support</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    <li>
                                        <a href="#" className="text-sm leading-6 text-zinc-600 hover:text-zinc-900">
                                            Documentation
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-sm leading-6 text-zinc-600 hover:text-zinc-900">
                                            Guides
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-sm leading-6 text-zinc-600 hover:text-zinc-900">
                                            API Status
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold leading-6 text-zinc-900">Company</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    <li>
                                        <a href="#" className="text-sm leading-6 text-zinc-600 hover:text-zinc-900">
                                            About
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-sm leading-6 text-zinc-600 hover:text-zinc-900">
                                            Blog
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-sm leading-6 text-zinc-600 hover:text-zinc-900">
                                            Careers
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-sm font-semibold leading-6 text-zinc-900">Legal</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    <li>
                                        <a href="#" className="text-sm leading-6 text-zinc-600 hover:text-zinc-900">
                                            Privacy
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-sm leading-6 text-zinc-600 hover:text-zinc-900">
                                            Terms
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-16 border-t border-black/10 pt-8 sm:mt-20 lg:mt-24">
                    <p className="text-xs leading-5 text-zinc-500">
                        &copy; 2024 Agent Elephant Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
