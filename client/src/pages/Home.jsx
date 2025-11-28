import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Home() {
    const { user } = useAuth();

    return (
        <div className="home">
            <h2>Welcome to RocketOdds!</h2>
            <p>
                Your premier destination for online roulette gaming. Experience the
                thrill of the spin and test your luck today!
            </p>
            <Link to={user ? "/dashboard" : "/register"}>
                <button>Get Started</button>
            </Link>
        </div>
    );
}

export default Home;