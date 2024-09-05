// components/Navigation.js
import Link from 'next/link';

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/authorization">
            <a>Authorization</a>
          </Link>
        </li>
        <li>
          <Link href="/facebook_page">
            <a>Facebook Page</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;