console.log("update.js")
articleId = urlParams.get("article_id");
console.log(articleId)





const toggleCategoryFields = (category) => {
    const inCategoryFields = document.querySelectorAll(".in_category1");
    const outCategoryFields = document.querySelectorAll(".out_category1");

    if (category === "in") {
        inCategoryFields.forEach((field) => {
            field.style.display = "block";
        });
        outCategoryFields.forEach((field) => {
            field.style.display = "none";
        });
    } else if (category === "out") {
        outCategoryFields.forEach((field) => {
            field.style.display = "block";
        });
        inCategoryFields.forEach((field) => {
            field.style.display = "none";
        });
    }
};


async function articleUpdate() {
    const content = document.getElementById('content1').value;
    const selectDay = document.getElementById('select_day').value;
    const category = document.getElementById("category").value;
    const inSubcategory = document.getElementById('in_category1').value;
    const outSubcategory = document.getElementById('out_category1').value;
    const exerciseTime1 = document.getElementById('exercise_time1').value;
    const checkStatus1 = document.getElementById('check_status1').value;
    const isPrivate1 = document.getElementById('is_private1').value;
    const token = localStorage.getItem("access");

    const subcategory = category === 'in' ? inSubcategory : outSubcategory;


    const formData = new FormData();
    formData.append("content1", content);
    formData.append("subcategory", subcategory);
    formData.append("select_day", selectDay);
    formData.append("exercise_time1", exerciseTime1)
    formData.append("check_status1", checkStatus1)
    formData.append("is_private1", isPrivate1)

    // const imageInput = document.getElementById("image-input");
    // const img = imageInput.files[0]; // 파일 업로드 input에서 선택한 파일 가져오기

    // if (img) {
    //     formData.append("profile_img", img);
    // }

    const response = await fetch(`${backend_base_url}/user/`, {
        method: "PUT",
        headers: {
            Authorization: "Bearer " + token,
        },
        body: formData,
    });


    if (response.status == 200) {
        alert("게시글 수정 완료")
    } else if (content == '' || exerciseTime1 == '') {
        alert("빈칸을 입력해 주세요.")
    } else {
        console.error("요청 실패:", response);
    }


}