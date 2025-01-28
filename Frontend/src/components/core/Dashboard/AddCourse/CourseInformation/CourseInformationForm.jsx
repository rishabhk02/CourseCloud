import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { HiOutlineCurrencyRupee } from "react-icons/hi"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"

import {
  addCourseDetails,
  editCourseDetails,
  fetchCourseCategories,
} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse, setStep } from "../../../../../slices/courseSlice"
import { COURSE_STATUS } from "../../../../../utils/constants"
import IconBtn from "../../../../Common/IconBtn"
import Upload from "../Upload"
import ChipInput from "./ChipInput"
import RequirementsField from "./RequirementsField"
import { FiClock } from "react-icons/fi"

export default function CourseInformationForm() {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const [isLoading, setIsLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState([]);
  const { course, editCourse } = useSelector((state) => state.course);
  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm();

  const fetchAllCategories = async () => {
    try {
      setIsLoading(true);
      const categories = await fetchCourseCategories();
      if (categories?.length > 0) {
        setCourseCategories(categories);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const setDefaultValue = () => {
    try {
      setValue("courseName", course.courseName);
      setValue("courseDescription", course.courseDescription);
      setValue("price", course.price);
      setValue("duration", course.duration);
      setValue("tags", course.tags);
      setValue("whatYouWillLearn", course.whatYouWillLearn);
      setValue("category", course.category);
      setValue("instructions", course.instructions);
      setValue("thumbnail", course.thumbnail);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchAllCategories();
    if (editCourse) {
      setDefaultValue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isFormUpdated = () => {
    const currentValues = getValues();
    if (
      currentValues.courseName !== course.courseName ||
      currentValues.courseDescription !== course.courseDescription ||
      currentValues.price !== course.price ||
      currentValues.duration !== course.duration ||
      currentValues.tags.toString() !== course.tags.toString() ||
      currentValues.whatYouWillLearn !== course.whatYouWillLearn ||
      currentValues.category._id !== course.category._id ||
      currentValues.instructions.toString() !==
      course.instructions.toString() ||
      currentValues.thumbnail !== course.thumbnail
    ) {
      return true;
    }
    return false;
  }

  //   handle next button click
  const handleFormSubmit = async (data) => {
    let toastId;
    try {
      setIsLoading(true);
      toastId = toast.loading("Submitting the form...");
      let result;
      if (!editCourse) {
        let formData = new FormData();
        formData.append("courseName", data.courseName);
        formData.append("courseDescription", data.courseDescription);
        formData.append("price", data.price);
        formData.append("duration", data.duration);
        formData.append("tags", data.tags);
        formData.append("whatYouWillLearn", data.whatYouWillLearn);
        formData.append("category", data.category);
        formData.append("status", COURSE_STATUS.DRAFT);
        formData.append("instructions", data.instructions);
        formData.append("thumbnail", data.thumbnail);

        result = await addCourseDetails(formData, token);
      } else if (isFormUpdated()) {
        const currentValues = getValues();
        const formData = new FormData();
        formData.append("courseId", course._id)
        if (currentValues.courseName !== course.courseName) {
          formData.append("courseName", data.courseName);
        }
        if (currentValues.courseDescription !== course.courseDescription) {
          formData.append("courseDescription", data.courseDescription);
        }
        if (currentValues.price !== course.price) {
          formData.append("price", data.price);
        }
        if (currentValues.duration !== course.duration) {
          formData.append("duration", data.duration);
        }
        if (currentValues.tags.toString() !== course.tags.toString()) {
          formData.append("tags", data.tags);
        }
        if (currentValues.whatYouWillLearn !== course.whatYouWillLearn) {
          formData.append("whatYouWillLearn", data.whatYouWillLearn);
        }
        if (currentValues.category._id !== course.category._id) {
          formData.append("category", data.category);
        }
        if (currentValues.instructions.toString() !== course.instructions.toString()) {
          formData.append("instructions", data.instructions);
        }
        if (currentValues.thumbnail !== course.thumbnail) {
          formData.append("thumbnail", data.thumbnail);
        }
        result = await editCourseDetails(course?._id, formData, token);
      } else {
        toast.error("No changes made to the form");
      }
      if (result) {
        dispatch(setStep(2));
        dispatch(setCourse(result));
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to add course. Please try again!');
    } finally {
      setIsLoading(false);
      toast.dismiss(toastId);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
    >
      {/* Course Title */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseName">
          Course Title <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="courseName"
          placeholder="Enter Course Title"
          {...register("courseName", { required: true })}
          className="form-style w-full"
        />
        {errors.courseName && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course title is required
          </span>
        )}
      </div>
      {/* Course Short Description */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseDescription">
          Course Description <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseDescription"
          placeholder="Enter Description"
          {...register("courseDescription", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.courseDescription && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Description is required
          </span>
        )}
      </div>
      {/* Course Price */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="price">
          Course Price <sup className="text-pink-200">*</sup>
        </label>
        <div className="relative">
          <input
            id="price"
            placeholder="Enter Course Price"
            {...register("price", {
              required: true,
              valueAsNumber: true,
              pattern: {
                value: /^(0|[1-9]\d*)(\.\d+)?$/,
              },
            })}
            className="form-style w-full !pl-12"
          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
        </div>
        {errors.price && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Price is required
          </span>
        )}
      </div>
      {/*Course Duration*/}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="duration">
          Course Duration <sup className="text-pink-200">*</sup>
        </label>
        <div className="relative">
          <input
            id="duration"
            placeholder="Enter Course Duration(hrs)"
            {...register("duration", {
              required: true,
              valueAsNumber: true,
              pattern: {
                value: /^(0|[1-9]\d*)(\.\d+)?$/,
              },
            })}
            className="form-style w-full !pl-12"
          />
          <FiClock className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
        </div>
        {errors.duration && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course duration is required
          </span>
        )}
      </div>
      {/* Course Category */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="category">
          Course Category <sup className="text-pink-200">*</sup>
        </label>
        <select
          {...register("category", { required: true })}
          defaultValue=""
          id="category"
          className="form-style w-full"
        >
          <option value="" disabled>
            Choose a Category
          </option>
          {!isLoading &&
            courseCategories?.map((category, indx) => (
              <option key={indx} value={category?._id}>
                {category?.categoryName}
              </option>
            ))}
        </select>
        {errors.category && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Category is required
          </span>
        )}
      </div>
      {/* Course Tags */}
      <ChipInput
        label="Tags"
        name="tags"
        placeholder="Enter Tags and press Enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />
      {/* Course Thumbnail Image */}
      <Upload
        name="thumbnail"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      />
      {/* Benefits of the course */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="whatYouWillLearn">
          Benefits of the course <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="whatYouWillLearn"
          placeholder="Enter benefits of the course"
          {...register("whatYouWillLearn", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.whatYouWillLearn && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Benefits of the course is required
          </span>
        )}
      </div>
      {/* Requirements/Instructions */}
      <RequirementsField
        name="instructions"
        label="Requirements/Instructions"
        register={register}
        setValue={setValue}
        errors={errors}
        getValues={getValues}
      />
      {/* Next Button */}
      <div className="flex justify-end gap-x-2">
        {editCourse && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={isLoading}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
          >
            Continue Wihout Saving
          </button>
        )}
        <IconBtn
          type='submit'
          disabled={isLoading}
          text={!editCourse ? "Next" : "Save Changes"}
        >
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  )
}
