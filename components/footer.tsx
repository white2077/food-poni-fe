import React from "react";
import CatBackground from "./pet";
import Link from "next/link";

const Footer = () => {

    return (
        <div className="bg-[#f5f5fa]">
            <CatBackground/>
            <footer>
                <div className="container">
                    <div className="content">

                        <div className="col">
                            <p>
                                <Link href="/">
                                    <div
                                        className="font-['Impact','fantasy'] text-4xl text-orange-500 cursor-pointer hover:text-orange-500">FoodPoni
                                    </div>
                                </Link>
                            </p>
                            <p>
                                hi, we are always open for cooperation and suggestions, <br/>
                                contact us in one of the ways below:
                            </p>
                            <div className="flex">
                                <div className="col-info">
                                    <p>
                                        PHONE NUMBER <br/>
                                        <span>+1 (800) 060-07-30</span>
                                    </p>
                                    <p>
                                        OUR LOCATION <br/>
                                        <span>715 Fake Street, New York<br/>
                10021 USA</span>
                                    </p>
                                </div>
                                <div className="col-info">
                                    <p>
                                        EMAIL ADDRESS <br/>
                                        <span>us@example.com</span>
                                    </p>

                                    <p>
                                        WORKING HOURS <br/>
                                        <span>Mon-sat 10:00pm - 7:00pm</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        ⁡⁢⁣⁡⁢⁣⁣ ⁡
                        <div className="col">
                            <div className="column">
                                <p>information</p>
                                <p>about us</p>
                                <p>delivery information</p>
                                <p>privacy policy</p>
                                <p>brands</p>
                                <p>contact us</p>
                                <p>returns</p>
                                <p>site map</p>
                            </div>
                        </div>
                        <div className="col">
                            <div className="column">
                                <p>my account</p>
                                <p>store location</p>
                                <p>order history</p>
                                <p>wish list</p>
                                <p>newsletter</p>
                                <p>special offers</p>
                                <p>gift certificates</p>
                                <p>affiliate</p>
                            </div>
                        </div>
                        ⁡⁢⁣⁣ ⁡
                        <div className="col">
                            <p>newsletter</p>
                            <p>
                                enter your email address below to subscribe to our newsletter<br/>
                                and keep up to date with discounts and special offers.
                            </p>
                            <div className="email">
                                <input type="email" placeholder="user@example.com"/>
                                <button>Subscribe</button>
                            </div>
                            <p>follow us on social networks:</p>
                            <div className="social">
                                <Link href="https://www.facebook.com/profile.php?id=100085580808149">
                                    <img src="https://i.postimg.cc/44pPB9wk/facebook.png" alt=""/>
                                </Link>
                                <img src="https://i.postimg.cc/L8Q3nB4f/twitter.png" alt=""/>
                                <img src="https://i.postimg.cc/TYG9S3Hy/instagram.png" alt=""/>
                                <Link href="https://www.youtube.com/watch?v=QwLvrnlfdNo">
                                    <img src="https://i.postimg.cc/kGCxkTwr/youtube.png" alt=""/>
                                </Link>
                                <img src="https://i.postimg.cc/CKZHDBd2/telegram.png" alt=""/>
                            </div>
                        </div>
                        ⁡⁢⁡⁢⁣⁣
                    </div>
                </div>
                <div className="content-foot">
                    <div className="container">
                        <div className="foot-text">
                            <p>powered by <span>tech</span> - designed by <span>hema</span></p>
                            <div className="pay">
                                <img src="https://i.postimg.cc/PrtWyFPY/visa-logo-png-2013.png" alt=""/>
                                <img src="https://i.postimg.cc/R0j1TSHZ/mastercard-PNG23.png" alt=""/>
                                <img src="https://i.postimg.cc/sggJj0zs/paypal-logo-png-2119.png" alt=""/>
                                <img src="https://i.postimg.cc/hjdsFzBm/American-Express-logo-PNG14.png" alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );

};

export default Footer;