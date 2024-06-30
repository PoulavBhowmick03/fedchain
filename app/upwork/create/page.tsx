"use client"

import { useDiamante } from "@/context/DiamanteContext";

const Create = () => {
    const {server, createAddress, storeDiam, storeBalance, giveDiam} = useDiamante()



    return ( 
        <div>
            <button onClick={createAddress}>
                hi
            </button>
            <button onClick={storeDiam}>
                store diam?
            </button>
            <button onClick={giveDiam}>
                store
            </button>
        </div>
     );
}
 
export default Create;