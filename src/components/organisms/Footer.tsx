import ChatBot from "@/components/organisms/ChatBot";
import CatBackground from "@/components/pet.tsx";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CartGroup } from "@/components/organisms/CartGroup";

export default function Footer() {
  const [showChatbot, setShowChatbot] = useState(false);

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };
  return (
    <div className="bg-[#f5f5fa]">
      <CatBackground />
      <footer>
        <div className="container">
          <div className="content">
            <div className="col">
              <div className="in-col">
                <Link to="/">
                  <div className="font-['Impact','fantasy'] text-4xl text-orange-500 cursor-pointer hover:text-orange-500">
                    FoodPoni
                  </div>
                </Link>
              </div>
              <div className="in-col">
                hi, we are always open for cooperation and suggestions, <br />
                contact us in one of the ways below:
              </div>
              <div className="flex">
                <div className="col-info">
                  <div className="in-col">
                    PHONE NUMBER <br />
                    <span>+1 (800) 060-07-30</span>
                  </div>
                  <div className="in-col">
                    OUR LOCATION <br />
                    <span>
                      715 Fake Street, New York
                      <br />
                      10021 USA
                    </span>
                  </div>
                </div>
                <div className="col-info">
                  <div className="in-col">
                    EMAIL ADDRESS <br />
                    <span>us@example.com</span>
                  </div>

                  <div className="in-col">
                    WORKING HOURS <br />
                    <span>Mon-sat 10:00pm - 7:00pm</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="column">
                <div className="in-col">information</div>
                <div className="in-col">about us</div>
                <div className="in-col">delivery information</div>
                <div className="in-col">privacy policy</div>
                <div className="in-col">brands</div>
                <div className="in-col">contact us</div>
                <div className="in-col">returns</div>
                <div className="in-col">site map</div>
              </div>
            </div>
            <div className="col">
              <div className="column">
                <div className="in-col">my account</div>
                <div className="in-col">store location</div>
                <div className="in-col">order history</div>
                <div className="in-col">wish list</div>
                <div className="in-col">newsletter</div>
                <div className="in-col">special offers</div>
                <div className="in-col">gift certificates</div>
                <div className="in-col">affiliate</div>
              </div>
            </div>
            <div className="col">
              <div className="in-col">newsletter</div>
              <div className="in-col">
                enter your email address below to subscribe to our newsletter
                <br />
                and keep up to date with discounts and special offers.
              </div>
              <div className="email rounded-lg">
                <input
                  className="border border-gray-300 rounded-lg p-2"
                  type="email"
                  placeholder="user@example.com"
                />
                <button className="bg-orange-500 text-white px-4 py-2 !rounded-lg">
                  Subscribe
                </button>
              </div>
              <div className="in-col">follow us on social networks:</div>
              <div className="social">
                <a
                  href="https://www.facebook.com/profile.php?id=100085580808149"
                  target="_blank"
                >
                  <img
                    src="https://i.postimg.cc/44pPB9wk/facebook.png"
                    alt=""
                  />
                </a>
                <img src="https://i.postimg.cc/L8Q3nB4f/twitter.png" alt="" />
                <img src="https://i.postimg.cc/TYG9S3Hy/instagram.png" alt="" />
                <a
                  href="https://www.youtube.com/watch?v=STzK1XrpoBs"
                  target="_blank"
                >
                  <img src="https://i.postimg.cc/kGCxkTwr/youtube.png" alt="" />
                </a>
                {/*<img src="https://i.postimg.cc/CKZHDBd2/telegram.png" alt=""/>*/}
              </div>
            </div>
          </div>
        </div>
        <div className="content-foot">
          <div className="container">
            <div className="foot-text">
              <div className="in-col">
                powered by <span>tech</span> - designed by <span>hema</span>
              </div>
              <div className="pay">
                <img
                  src="https://i.postimg.cc/PrtWyFPY/visa-logo-png-2013.png"
                  alt=""
                />
                <img
                  src="https://i.postimg.cc/R0j1TSHZ/mastercard-PNG23.png"
                  alt=""
                />
                <img
                  src="https://i.postimg.cc/sggJj0zs/paypal-logo-png-2119.png"
                  alt=""
                />
                <img
                  src="https://i.postimg.cc/hjdsFzBm/American-Express-logo-PNG14.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </footer>
      <ChatBot showChatbot={showChatbot} toggleChatbot={toggleChatbot} />
      <CartGroup />
    </div>
  );
}