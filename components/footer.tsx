import React from "react";
import CatBackground from "./pet";
import Link from "next/link";

const Footer = () => {
    return (
        <div className="bg-[#f5f5fa]">
            <CatBackground />
            <footer>
                <div className="container">
                    <div className="content">
                        <div className="col">
                            <div className="in-col">
                                <Link href="/">
                                    <div className="font-family: 'Impact', 'fantasy'; text-4xl text-orange-500 cursor-pointer hover:text-orange-500">FoodPoni</div>
                                </Link>
                            </div>
                            <div className="in-col">
                                hi, we are always open for cooperation and suggestions, <br/>
                                contact us in one of the ways below:
                            </div>
                            <div className="flex">
                                <div className="col-info">
                                    <div className="in-col">
                                        PHONE NUMBER <br/>
                                        <span>+1 (800) 060-07-30</span>
                                    </div>
                                    <div className="in-col">
                                        OUR LOCATION <br/>
                                        <span>715 Fake Street, New York<br/>
                10021 USA</span>
                                    </div>
                                </div>
                                <div className="col-info">
                                    <div className="in-col">
                                        EMAIL ADDRESS <br/>
                                        <span>us@example.com</span>
                                    </div>

                                    <div className="in-col">
                                        WORKING HOURS <br/>
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
                                enter your email address below to subscribe to our newsletter<br/>
                                and keep up to date with discounts and special offers.
                            </div>
                            <div className="email">
                                <input type="email" placeholder="user@example.com"/>
                                <button>Subscribe</button>
                            </div>
                            <div className="in-col">follow us on social networks:</div>
                            <div className="social">
                                <Link href="https://www.facebook.com/profile.php?id=100085580808149">
                                    <img src="https://i.postimg.cc/44pPB9wk/facebook.png" alt=""/>
                                </Link>
                                <img src="https://i.postimg.cc/L8Q3nB4f/twitter.png" alt=""/>
                                <img src="https://i.postimg.cc/TYG9S3Hy/instagram.png" alt=""/>
                                <Link href="https://www.youtube.com/watch?v=SMNB0fNU1Nw&list=RDSMNB0fNU1Nw&index=1">
                                    <img src="https://i.postimg.cc/kGCxkTwr/youtube.png" alt=""/>
                                </Link>
                                <img src="https://i.postimg.cc/CKZHDBd2/telegram.png" alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content-foot">
                    <div className="container">
                        <div className="foot-text">
                            <div className="in-col">powered by <span>tech</span> - designed by <span>hema</span></div>
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