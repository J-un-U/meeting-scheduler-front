import CreateMeetingModal from "./CreateMeetingModal";
import Header from "@/app/components/layout/Header";
import Sidebar from "@/app/components/layout/Sidebar";
import Content from "@/app/components/layout/Content";

const Dashboard = () => {
  return(
    <>
      <Header>
        <div className={"flex items-center justify-between"}>
          <button>미팅 스케쥴러</button>
          <CreateMeetingModal />
        </div>
      </Header>
      <Sidebar>
        <div>사이드바</div>
      </Sidebar>
      <Content>
        <div>내용</div>
      </Content>
    </>
  )
};

export default Dashboard;
