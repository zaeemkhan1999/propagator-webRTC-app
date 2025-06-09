import { Button } from "@mui/material"
import SearchBar from "../../../../../Explore/Components/SearchBar"
import NoData from '../NoData.json'
import Lottie from 'lottie-react';
import { useState } from "react";

const Hidestory = () => {

    const [searchTerm, setSearchTerm] = useState<string>('');

    return (
        <div className="w-full">
            <h4 className='my-3 ms-4'> Hide Stories</h4>

            <div className="h-[80vh] overflow-y-auto pb-[100px] flex flex-col justify-between">
                <SearchBar className="h-[60px]" searchTerm={searchTerm} setSearchTerm={setSearchTerm} cb={() => { }} />
                <div>
                    <Lottie
                        loop={false}
                        animationData={NoData}
                        style={{ width: '200px', height: '200px', margin: '0 auto' }}
                    />
                </div>
                <div className="flex justify-center my-4">
                    <Button variant="contained" className="p-6 w-[400px] rounded-[12px]">Done</Button>
                </div>
            </div>
        </div>
    )
}
export default Hidestory