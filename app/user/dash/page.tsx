import HeadElement from "@/app/user/components/Head";
import Sidebar from "@/app/user/components/Sidebar";
import Body from "@/app/user/components/body";

const Dashboard = () => {
    return ( 
        <div className="h-screen">
        <Sidebar/> 
        <div className="sm:pl-24 ">
        <HeadElement/>
         <Body/>
         </div>
        </div>
     );
}
 
export default Dashboard;