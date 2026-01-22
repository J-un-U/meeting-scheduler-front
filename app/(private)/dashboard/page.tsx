import Header from "@/app/components/layout/Header";
import Sidebar from "@/app/components/layout/Sidebar";

const Dashboard = () => {
  return(
    <>
      <Header>
        <div className={"flex items-center justify-between"}>
          <button>미팅 스케쥴러</button>
          <button className={"bg-blue-600 text-white px-4 py-2 rounded-md"}>약속만들기</button>
        </div>
      </Header>
      <Sidebar>
        <div>사이드바</div>
      </Sidebar>
    </>
  )
};

export default Dashboard;