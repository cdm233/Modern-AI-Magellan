import axios from 'axios';


const axios_post = (endpoint, action, request_payload)=>{
    axios.post(endpoint, {
        request: action,
        payload: request_payload
    }).then(response => {
        console.log(response.data);

        return response.data;
    }).catch(error => {
        if (error.response) {
            console.log(error.response.data);
            alert(JSON.stringify(error.response.data));
        } else {
            console.error('Error', error);
        }

        return null;
    });
}

const format_course_data_source = (groupedCourses) => {
    var formattedDataSource = [];

    var maxCourseCount = 1;
    for (var cur_courses of Object.values(groupedCourses)) {
        if (cur_courses.length > maxCourseCount) {
            maxCourseCount = cur_courses.length;
        }
    }

    for (const [term, courses] of Object.entries(groupedCourses)) {
        const curTermCourseList = [];

        for (var i = 0; i < maxCourseCount; i++) {
            if (i < courses.length) {
                curTermCourseList.push({
                    course_name: courses[i]["course_name"],
                    course_code: courses[i]["course_code"],
                    course_status: courses[i]["course_status"],
                    course_term: courses[i]["course_term"],
                });
            }
        }

        formattedDataSource.push({
            key: `${term}`,
            term_name: term,
            term_courses: curTermCourseList,
        });
    }

    return formattedDataSource;
};

const alphanumerical = ()=>{
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let sequence = '';
    for (let i = 0; i < 9; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        sequence += chars[randomIndex];
    }
    return sequence;
}

export {format_course_data_source, alphanumerical, axios_post};