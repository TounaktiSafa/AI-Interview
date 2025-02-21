import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
    return (
        <footer className="rounded-lg shadow-sm bg-gray-100">
            <div className="">
            <div className="sm:flex sm:items-center sm:justify-center">
            <img src="/logofooter.png" className="w-20 md:w-20" alt="Logo" />
            </div>

                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
                    &copy; {new Date().getFullYear()}{' '}
                    <Link
                        href="https://flowbite.com/"
                        className="hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Interview AI
                    </Link>
                    . All Rights Reserved.
                </span>
            </div>
        </footer>
    );
};

export default Footer;