// // 사용자가 텍스트를 드래그하는 중에 선택된 텍스트를 감지
// document.addEventListener('selectionchange', function() {
//     const selectedText = window.getSelection().toString().trim();
// });

// 드래그가 끝났을 때 번역 버튼을 표시
document.addEventListener('mouseup', function(event) {
    const selectedText = window.getSelection().toString().trim();
    const isTranslateButton = event.target.closest(".translation-button");
    if (selectedText && !isTranslateButton) {
        console.log('드래그 완료 후 선택된 텍스트:', selectedText);
        // 번역 버튼을 표시하는 함수를 호출합니다.
        showTranslateButton(event, selectedText);
    } else {
        // 선택된 텍스트가 없으면 번역 버튼을 제거합니다.
        removeExistingButton();
    }
});

// 번역 버튼을 표시하는 함수
function showTranslateButton(event, selectedText) {
    // 기존 번역 버튼 제거
    const translateButton = document.createElement("button");
    translateButton.textContent = "번역";
    translateButton.className = "translate-button";
    translateButton.style.position = "absolute";
    translateButton.style.top = `${event.pageY + 10}px`;
    translateButton.style.left = `${event.pageX}px`;
    translateButton.style.zIndex = "9999";
    translateButton.style.backgroundColor = "#4CAF50";
    translateButton.style.color = "white";
    translateButton.style.border = "none";
    translateButton.style.borderRadius = "5px";
    translateButton.style.padding = "5px";
    translateButton.style.cursor = "pointer";

    document.body.appendChild(translateButton);

    // 번역 버튼 클릭 이벤트
    translateButton.addEventListener("mouseup", function (e) {
        e.stopPropagation();
        console.log("번역 버튼이 클릭되었습니다.");
        fetchTranslation(selectedText, translateButton);
    });

    // // 버튼 외부를 클릭하면 버튼 제거
    // setTimeout(() => {
    //     document.addEventListener("click", handleOutsideClick);
    // }, 0);
}


// 기존 버튼 제거 함수
function removeExistingButton() {
    console.log("Remove buttons")
    const existingButtons = document.querySelectorAll(".translate-button");
    existingButtons.forEach(button => button.remove());
}

// 외부 클릭 처리 함수
// function handleOutsideClick(event) {
//     const isTranslateButton = event.target.closest(".translate-button");
//     if (!isTranslateButton) {
//         removeExistingButton();
//         document.removeEventListener("click", handleOutsideClick); // 이벤트 제거
//     }
// }

// 번역 API 호출 함수
async function fetchTranslation(text, button) {
    console.log("Fetch"); // 이 부분이 이제 출력될 것입니다.
    const apiKey = "input your key"; // API 키를 안전하게 관리하세요

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{
                    "role": "user",
                    "content": `Translate the following English text to Korean:\n\n${text}`,
                }],
            }),
        });

        const data = await response.json();

        if (response.ok) {
            const translatedText = data.choices[0].message.content.trim(); // 'gpt-3.5-turbo' 모델에 맞게 경로 수정
            console.log("Translated Text:", translatedText);
            showTranslation(button, translatedText);
        } else {
            console.error("API Error:", data);
            alert("번역 중 오류가 발생했습니다.");
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        alert("번역 요청 중 오류가 발생했습니다.");
    }
}

// 번역 결과 표시 함수
function showTranslation(button, translatedText) {
    removeExistingTranslationBox();

    const translationBox = document.createElement("div");
    translationBox.textContent = translatedText;
    translationBox.className = "translation-box";
    translationBox.style.position = "absolute";
    translationBox.style.backgroundColor = "#FFF";
    translationBox.style.color = "#000";
    translationBox.style.border = "1px solid #CCC";
    translationBox.style.padding = "10px";
    translationBox.style.borderRadius = "5px";
    translationBox.style.zIndex = "9999";

    // 선택 영역의 위치와 크기 가져오기
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // 번역 결과 박스의 위치와 너비 설정
        translationBox.style.top = `${window.scrollY + rect.bottom + 5}px`; // 선택 영역 아래에 5px 띄워서 표시
        translationBox.style.left = `${window.scrollX + rect.left}px`; // 선택 영역의 왼쪽에 맞춤
        translationBox.style.width = `${rect.width}px`; // 선택 영역의 너비에 맞춤
    }

    document.body.appendChild(translationBox);

    // 버튼 제거
    button.remove();

    // 번역 결과 영역 외부 클릭 시 제거
    document.addEventListener("click", function handleTranslationBoxClick(event) {
        const isTranslationBox = event.target.closest(".translation-box");
        if (!isTranslationBox) {
            translationBox.remove();
            document.removeEventListener("click", handleTranslationBoxClick);
        }
    });
}

function removeExistingTranslationBox() {
    const existingBoxes = document.querySelectorAll(".translation-box");
    existingBoxes.forEach(box => box.remove());
}