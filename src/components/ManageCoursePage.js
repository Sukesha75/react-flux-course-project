import React, { useState,useEffect } from 'react';
import CourseForm from './CourseForm';
import CourseStore from '../stores/courseStore';
import {toast} from 'react-toastify';
import * as courseActions from '../actions/courseActions';

const ManageCoursePage = props => {
const[errors,setErrors]=useState({});
const [ courses, setCourses] = useState(CourseStore.getCourses());
const [ course, setCourse] = useState({
  id:null,
  slug:"",
  title:"",
  authorId:"",
  category:""
});

      useEffect( () =>{
        CourseStore.addChangeListener(onChange);
          const slug=props.match.params.slug;
          if(courses.length===0){
            courseActions.loadCourses();
          }
          else if (slug){
          setCourse(CourseStore.getCourseBySlug(slug));
          }
          return ()=> CourseStore.removeChangeListener(onChange);
        },[courses.length, props.match.params.slug]);

function onChange(){
  setCourses(CourseStore.getCourses());
}

function handleChange({target}){
  setCourse(
    {
      ...course,
       [target.name] : target.value
    }
    );
}

function formIsValid(){
  const _errors = {};
  if(!course.title) _errors.title="Title is Required.";
  if(!course.authorId) _errors.authorId="Author Id is Required.";
  if(!course.category) _errors.category="Category is Required.";

  setErrors(_errors);
  //Form is valid if the errors objects has no properties.
  return Object.keys(_errors).length ===0;
}

function handleSubmit(event){
  event.preventDefault();
  if(!formIsValid()) return;
  courseActions.saveCourse(course).then(()=>{
    props.history.push("/courses");
    toast.success("Course Saved.");
  });
}

  return(
     <>
     <h2>Manage Course.</h2>
     <CourseForm course={course}  onChange={handleChange} onSubmit={handleSubmit} errors={errors}/>
     </>
  );
};
export default ManageCoursePage;