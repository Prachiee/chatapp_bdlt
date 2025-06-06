import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";

//INTERNAL IMPORT
import Style from "./Filter.module.css";
import images from "../../assets";
import { ChatAppContext } from "@/Context/ChatAppContext";
import { Model } from "../index";

const Filter = () => {
    const { account, addFriends } = useContext(ChatAppContext);
    //USESTATE
    const [addFriend, setAddFriend] = useState(false);
  return (
    <div className={Style.Filter}>
        <div className={Style.Filter_box}>
            <div className={Style.Filter_box_left}>
                <div className={Style.Filter_box_left_search}>
                    <Image src={images.search} alt="image" width={20} height={20} />
                    <input type="text" placeholder="search.." />
                </div>
            </div>
            <div className={Style.Filter_box_right}>
                <button>
                    <Image src={images.clear} alt="clear" width={20} height={20} />
                    CLEAR CHAT
                </button>
                <button onClick={() => setAddFriend(true)}>
                    <Image src={images.user} alt="clear" width={20} height={20} />
                    ADD FRIEND
                </button>
            </div>
        </div>

        {/* //MODEL COMPONENT */}
        {addFriend && (
            <div className={Style.Filter_model}>
                <Model
                    openBox={setAddFriend}
                    title="WELCOME TO"
                    head="CHAT BUDDY"
                    info="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Culpa pariatur esse quis ea asperiores? Quaerat corrupti culpa pariatur repellendus, quas eveniet quidem quos voluptatum quasi officiis. Facilis officia consequuntur iusto!"
                    smallInfo="Kindly Select Your Friend's Name and Address.."
                    image={images.hero}
                    functionName={addFriends}
                />
            </div>
        )}
    </div>
  );
};

export default Filter;