import {
    LayoutDashboard,
    Users,
    Layers,
    UserRound,
    GraduationCap,
    ClipboardCheck,
    ClipboardList,
    TrendingUp,
    Megaphone,
    Settings,
    ChevronRight,
    CircleUserRound
} from "lucide-react"
import './Sidebar.css'
import astumsjLogo from "../../assets/astumsj-logo.png"

function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <img
                  src={astumsjLogo}
                  alt="ASTUMSJ Logo"
                  className="logo-image"
                />
                    <a href="#"
                className="sidebar-link active">
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>  
                    </a>
            </div>
            <div className="sidebar-section">
                    <p className="sidebar-section-title">
                        MAIN
                    </p>
                    <a href="#"
                className="sidebar-link">
                    <Users size={20} />
                    <span>Users</span>
                    </a>
                    <a href="#"
                className="sidebar-link">
                    <Layers size={20} />
                    <span>Batches</span>
                    </a>
                    <a href="#" 
                className="sidebar-link">
                    <UserRound size={20} />
                    <span>Mentors</span>
                    </a>
                    <a href="#"
                className="sidebar-link">
                    <GraduationCap size={20} />
                    <span>Students</span>
                </a>
            </div>
            
            <div className="sidebar-section">
                <p className="sidebar-section-title">
                    ACADEMICS
                </p>
                <a href="#"
            className="sidebar-link">
                <ClipboardCheck size={20} />
                <span>Attendance</span>
                </a>
                <a href="#"
            className="sidebar-link">
                <ClipboardList size={20} />
                <span>Assignments</span>
                </a>
                <a href="#"  
            className="sidebar-link" >
                <TrendingUp size={20} />
                <span>Progress</span>
                </a>
                </div>
            <div
            className="sidebar-section">
                <p className="sidebar-section-title">
                    COMMUNICATION
                </p>
                <a href="#"
            className="sidebar-link">
                    <Megaphone size={20} />
                    <span>Announcements</span>
                </a>
            </div>
            <div
            className="sidebar-section">
                <p className="sidebar-section-title">
                    SYSTEM
                </p>
                <a href="#"
            className="sidebar-link">
                    <Settings size={20} />
                    <span>Settings</span>
                </a>
            </div>
            <div 
            className="sidebar-profile">
            <div className="profile-avater">
                <CircleUserRound size={22} />
            </div>
            <div 
            className="profile-info">
                <strong>Admin User</strong>
                <span>Super Admin</span>
            </div>
            <ChevronRight size={18} />
            </div>
        </aside>
    )
}
export default Sidebar
        
