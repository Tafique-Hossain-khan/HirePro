import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-textColor-bgText pt-16 pb-8" id="contact">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-textColor to-purple-600">
                                HirePro
                            </span>
                        </div>
                        <p className="text-muted-foreground mb-4 max-w-md">
                            HirePro is the ultimate platform for smart hiring and career advancement, powered by AI technology that connects the right talent with the right opportunities.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-muted-foreground hover:text-textColor transition-colors" aria-label="Facebook">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-textColor transition-colors" aria-label="Twitter">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-textColor transition-colors" aria-label="Instagram">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-textColor transition-colors" aria-label="LinkedIn">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium text-lg mb-4">Product</h3>
                        <ul className="space-y-3">
                            {['Features', 'Pricing', 'Testimonials', 'FAQ'].map((item, i) => (
                                <li key={i}>
                                    <a href="#" className="text-muted-foreground hover:text-textColor transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-medium text-lg mb-4">Company</h3>
                        <ul className="space-y-3">
                            {['About Us', 'Careers', 'Blog', 'Press'].map((item, i) => (
                                <li key={i}>
                                    <a href="#" className="text-muted-foreground hover:text-textColor transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-medium text-lg mb-4">Support</h3>
                        <ul className="space-y-3">
                            {['Contact Us', 'Help Center', 'Terms of Service', 'Privacy Policy'].map((item, i) => (
                                <li key={i}>
                                    <a href="#" className="text-muted-foreground hover:text-textColor transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} HirePro. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <a href="#" className="text-sm text-muted-foreground hover:text-textColor transition-colors">
                                Terms
                            </a>
                            <a href="#" className="text-sm text-muted-foreground hover:text-textColor transition-colors">
                                Privacy
                            </a>
                            <a href="#" className="text-sm text-muted-foreground hover:text-textColor transition-colors">
                                Cookies
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
