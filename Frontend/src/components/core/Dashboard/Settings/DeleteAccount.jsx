import { FiTrash2 } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { deleteProfile } from "../../../../services/operations/SettingsAPI";

export default function DeleteAccount() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  async function handleDeleteAccount() {
    try {
      dispatch(deleteProfile(token, navigate));
    } catch (error) {
      console.error(error);
    }
  }

  const handleDeleteClick = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // handleDeleteAccount();
        Swal.fire("Deleted!", "Your account has been deleted.", "success");
      }
    });
  };

  return (
    <div className="my-10 flex flex-row gap-x-5 rounded-md border-[1px] border-pink-700 bg-pink-900 p-8 px-12">
      <div className="flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-pink-700">
        <FiTrash2 className="text-3xl text-pink-200" />
      </div>
      <div className="flex flex-col space-y-2">
        <h2 className="text-lg font-semibold text-richblack-5">
          Delete Account
        </h2>
        <div className="w-3/5 text-pink-25">
          <p>Would you like to delete your account?</p>
          <p>
            This account may contain Paid Courses. Deleting your account is
            permanent and will remove all the content associated with it.
          </p>
        </div>
        <button
          type="button"
          className="w-fit cursor-pointer italic text-pink-300"
          onClick={handleDeleteClick}
        >
          I want to delete my account.
        </button>
      </div>
    </div>
  );
}
