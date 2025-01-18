import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { createSubSection, updateSubSection } from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import IconBtn from "../../../../Common/IconBtn";
import Upload from "../Upload";

export default function SubSectionModal({ modalData, setModalData, add = false, view = false, edit = false }) {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const [isLoading, setIsLoading] = useState(false);
  const course = useSelector((state) => state.course.course);
  const { register, handleSubmit, setValue, formState: { errors }, getValues } = useForm();

  useEffect(() => {
    if (view || edit) {
      setValue("title", modalData.title);
      setValue("description", modalData.description);
      setValue("video", modalData.videoUrl);
    }
  }, []);

  const isFormUpdated = () => {
    const currentValues = getValues();
    if (currentValues.title !== modalData.title || currentValues.description !== modalData.description || currentValues.video !== modalData.videoUrl) {
      return true;
    }
    return false;
  }

  const handleEditSubsection = async () => {
    try {
      setIsLoading(true);
      const currentValues = getValues();
      const formData = new FormData();
      formData.append("courseId", course._id);
      formData.append("sectionId", modalData.sectionId)
      formData.append("subSectionId", modalData._id)
      if (currentValues.title !== modalData.title) {
        formData.append("title", currentValues.title)
      }
      if (currentValues.description !== modalData.description) {
        formData.append("description", currentValues.description)
      }
      if (currentValues.video !== modalData.videoUrl) {
        formData.append("video", currentValues.video)
      }
      const result = await updateSubSection(formData, token);
      if (result) {
        const updatedCourseContent = course?.courseContent?.map((section) =>
          section._id === modalData?.sectionId ? result : section
        );
        const updatedCourse = { ...course, courseContent: updatedCourseContent };
        dispatch(setCourse(updatedCourse));
      }
      setModalData(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const onSubmit = async (data) => {
    if (view) return;
    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No changes made to the form");
      } else {
        handleEditSubsection();
      }
      return;
    }
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("courseId", modalData.courseId);
      formData.append("sectionId", modalData.sectionId);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("video", data.video);

      const result = await createSubSection(formData, token);
      if (result) {
        const updatedCourseContent = course?.courseContent?.map((section) =>
          section._id.toString() === modalData.sectionId.toString() ? result : section
        );
        const updatedCourse = { ...course, courseContent: updatedCourseContent };
        dispatch(setCourse(updatedCourse));
      }
      setModalData(null);
    } catch (error) {
      console.error(error);
    } finally{
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
          </p>
          <button onClick={() => (!isLoading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>
        {/* Modal Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 px-8 py-10"
        >
          {/* Lecture Video Upload */}
          <Upload
            name="video"
            label="Lecture Video"
            register={register}
            setValue={setValue}
            errors={errors}
            video={true}
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}
          />
          {/* Lecture Title */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="title">
              Lecture Title {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
              disabled={view || isLoading}
              id="title"
              placeholder="Enter Lecture Title"
              {...register("title", { required: true })}
              className="form-style w-full"
            />
            {errors.title && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture title is required
              </span>
            )}
          </div>
          {/* Lecture Description */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="description">
              Lecture Description{" "}
              {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <textarea
              disabled={view || isLoading}
              id="description"
              placeholder="Enter Lecture Description"
              {...register("description", { required: true })}
              className="form-style resize-x-none min-h-[130px] w-full"
            />
            {errors.description && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture Description is required
              </span>
            )}
          </div>
          {!view && (
            <div className="flex justify-end">
              <IconBtn
                disabled={isLoading}
                text={isLoading ? "Loading.." : edit ? "Save Changes" : "Save"}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
