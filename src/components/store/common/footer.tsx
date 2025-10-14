import Image from "next/image";
import Link from "next/link";
import Logo from "../../../../public/images/logo.png";
// components/Footer.js
export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="lg:col-span-1">
            <Link href="/">
              <Image src={Logo} alt="" className="w-36 h-auto" />
            </Link>
            {/* Social media icons */}
            <div className="flex space-x-4 mt-10">
              <Link href="#" className="text-gray-400 hover:text-gray-600">
                <span className="sr-only">Facebook</span>
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-600">
                <span className="sr-only">Twitter</span>
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-600">
                <span className="sr-only">Instagram</span>
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
              </Link>
            </div>
          </div>

          {/* ELLE */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              POUR ELLE
            </h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link
                  href="/categories/femmes/vetements/hautstop"
                  className="hover:text-gray-900"
                >
                  Hauts/Tops
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/femmes/vetements/manteauxvestes"
                  className="hover:text-gray-900"
                >
                  Manteaux/Vestes
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/femmes/vetements/pantalons"
                  className="hover:text-gray-900"
                >
                  Pantalons
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/femmes/vetements/ensembles"
                  className="hover:text-gray-900"
                >
                  Ensembles
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/femmes/vetements/accessoires"
                  className="hover:text-gray-900"
                >
                  Accessoires
                </Link>
              </li>
            </ul>
          </div>

          {/* LUI */}
          <div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                POUR LUI
              </h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>
                  <Link
                    href="/categories/hommes/vetements/hautstop"
                    className="hover:text-gray-900"
                  >
                    Hauts/Tops
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categories/hommes/vetements/manteauxvestes"
                    className="hover:text-gray-900"
                  >
                    Manteaux/Vestes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categories/hommes/vetements/pantalons"
                    className="hover:text-gray-900"
                  >
                    Pantalons
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categories/hommes/vetements/ensembles"
                    className="hover:text-gray-900"
                  >
                    Ensembles
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categories/hommes/vetements/accessoires"
                    className="hover:text-gray-900"
                  >
                    Accessoires
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              COLLECTIONS
            </h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link
                  href="/categories/femmes/chaussures"
                  className="hover:text-gray-900"
                >
                  Chaussures femme
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/hommes/chaussures"
                  className="hover:text-gray-900"
                >
                  Chaussures homme
                </Link>
              </li>
            </ul>
          </div>

          {/* <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              PAYMENT METHODS
            </h4>
            <div className="flex flex-wrap gap-2">
              <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-xs">VISA</span>
              </div>
              <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-xs">MC</span>
              </div>
              <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-xs">PP</span>
              </div>
            </div>
          </div> */}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <p className="text-center text-sm text-gray-500"></p>
        </div>
      </div>
    </footer>
  );
}
