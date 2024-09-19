function get_student_data(){
    function get_course_status(node_style){
        var node_color = node_style['color']

        if (node_color === 'rgb(0, 0, 0)' || node_color === ''){
            // This means the course is completed and passed.
            return 0;
        } else if (node_color === 'rgb(255, 153, 0)') {
            //This means the course is either is progress in the current year or is in your profile to be taken in a future session.
            return 1;
        } else if (node_color === 'rgb(170, 170, 170)') {
            // This means you have failed the course and no credit is given.
            return 2;
        } else {
            // This means a course is required that has either been failed or not taken and is not in any future sessions in your profile
            return -1;
        }
    }

    // Get student info from Magellan
    var student_data = {}
    var student_schedule_table = document.querySelector("#s_course > tbody")

    var student_info_table = Array.from(document.querySelector("body > table > tbody > tr:nth-child(4) > td > table:nth-child(3) > tbody").children).slice(1)

    for(var info_row of student_info_table){
        var item_name = info_row.children[0].innerText
        var item_value = info_row.children[1].innerText
        student_data[item_name] = item_value
    }
    
    var schedule_data = []
    for(var term_row of student_schedule_table.children){
        if(term_row.children.length === 1){
            continue
        }
    
        var cur_term = term_row.children[0].innerText
        var courses = Array.from(term_row.children)
        
        for(td of courses.slice(1)){
            var course_code = td.innerText.split('\n')[0    ]
            var course_name = td.innerText.split('\n')[1]
    
            const element_style = td.style.color === '' ? td.getElementsByTagName('a')[0].style : td.style;
            
            schedule_data.push({
                "course_term": cur_term,
                "course_code": course_code,
                "course_name": course_name,
                "course_status": get_course_status(element_style)
            })
        }
    }

    student_data['schedule'] = schedule_data
    console.log(student_data)
}