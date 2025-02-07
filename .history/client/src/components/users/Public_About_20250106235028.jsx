import React from "react"; // Update this path to your actual image
import "../../App.css";

export default function About() {
    return (
        <div className="about-page">
            <h2>What Our CCA Does?</h2>
            <p>
                <b>
                    Welcome to our club, a vibrant community of creativity and
                    self-expression!
                </b>
            </p>
            <div className="about-content">
                <div className="about-text">
                    <p>
                        Here, people who share similar interests gather to
                        pursue their passions, whether they be acting,
                        directing, set design, or just appreciating the art of
                        performance. We provide courses, events, and hands-on
                        activities that encourage collaboration, creativity, and
                        development because we believe that creativity has no
                        bounds.
                    </p>
                    <p>
                        From short videos to stage plays, our members push the
                        creative horizon. Regardless of experience level, there
                        is a friendly environment to develop your abilities and
                        discover unique ability. We all enjoy the pleasure of
                        storytelling, acting, and working together.
                    </p>
                    <p>
                        So, what are you waiting for? Let's join{" "}
                        <b>"Arising Starlights"</b> and come celebrate the glory
                        of the performing arts, share ideas, and create
                        connections that will last a lifetime.
                    </p>
                    <p>
                        <i>
                            We're excited to have you here, and there's a spot
                            for everyone!
                        </i>
                    </p>
                </div>
                <div className="about-image">
                    <img src="/assets/AboutUs.jpg" alt="Theater stage" />
                </div>
            </div>
        </div>
    );
}
