import Link from "next/link";
import React from "react";

type FooterProps = {};

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="footer p-10 bg-neutral text-neutral-content mt-10">
      <nav>
        <header className="footer-title">Services</header>
        <a className="link link-hover line-through">Branding</a>
        <a className="link link-hover line-through">Design</a>
        <a className="link link-hover line-through">Marketing</a>
        <a className="link link-hover line-through">Advertisement</a>
      </nav>
      <nav>
        <header className="footer-title">Company</header>
        <Link className="link link-hover line-through" href="/">
          About us
        </Link>
        <Link className="link link-hover" href="/contact">
          Contact
        </Link>
        <Link className="link link-hover line-through" href="/">
          Jobs
        </Link>
      </nav>
      <nav>
        <header className="footer-title">Legal</header>
        <Link className="link link-hover" href="/terms">
          Terms of use
        </Link>
        <Link className="link link-hover" href="/privacy">
          Privacy policy
        </Link>
        <Link className="link link-hover" href="/cookie">
          Cookie policy
        </Link>
      </nav>
    </footer>
  );
};
export default Footer;
