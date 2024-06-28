"use client"
import Head from "@/app/organisation/components/Head";
import Sidebar from "@/app/organisation/components/Sidebar";
import { OrgDashBody } from "@/components/orgbody";
import { FlipWordsDemo } from "@/components/orgdash";
import { OrgTestimonial } from "@/components/orgtestimonial";


const OrgDash = () => {
    return (
        <div className="dark:bg-gray-900">
            <div className="h-screen fixed ">
                <Sidebar />
            </div>
            <div className="sm:px-8">
            <Head/>

            </div>
            {/* <FlipWordsDemo /> */}
            <OrgDashBody />
        </div>
    );
}

export default OrgDash;