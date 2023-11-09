import Link from "next/link";
import React from "react";

type FooterProps = {};

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="footer p-10 bg-neutral  mt-10 text-white">
      <p className="text-lg max-w-[20rem]">
        {`FreeVRGame is a website you can download kinds of type of VR games for
        free. We will keep on updating contents.`}
      </p>
      <nav>
        <header className="footer-title ">Company</header>
        <Link className="link link-hover " href="/">
          About us
        </Link>
        <Link className="link link-hover " href="/">
          Contact
        </Link>
        <Link className="link link-hover " href="/">
          Jobs
        </Link>
      </nav>
      <nav>
        <header className="footer-title ">Legal</header>
        <Link className="link link-hover " href="/">
          Terms of use
        </Link>
        <Link className="link link-hover " href="/">
          Privacy policy
        </Link>
        <Link className="link link-hover " href="/">
          Cookie policy
        </Link>
      </nav>
    </footer>
  );
};
export default Footer;
