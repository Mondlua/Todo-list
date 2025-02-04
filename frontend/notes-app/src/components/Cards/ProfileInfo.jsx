import { getInitials } from "../../utils/helper";

const ProfileInfo = ({ userInfo, onLogout}) => {
  return (
    <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center rounded-full text-primary font-semibold bg-[#f1eaf7]">{getInitials(userInfo?.fullName || '')}</div>
        <div>
            <p className="text-sm font-semibold text-primary"> {userInfo?.fullName || "Usuario"}</p>
            <button className="text-sm font-medium text-[#5b50b1] underline cursor-pointer" onClick={onLogout}>
                Cerrar Sesión
            </button>
        </div>
    </div>
  )
}

export default ProfileInfo