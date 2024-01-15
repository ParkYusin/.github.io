<!-- D:\xampp\htdocs\save_user_info.php -->
<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 사용자 정보 가져오기
    $username = $_POST["username"];
    $email = $_POST["email"];

    // 사용자 정보를 파일에 저장 (D 드라이브의 C:\xampp\htdocs 디렉토리에 저장)
    $data = "이름: $username, 이메일: $email\n";
    $file_path = "C:\\xampp\\htdocs\\user_info.txt";
    file_put_contents($file_path, $data, FILE_APPEND | LOCK_EX);

    // 클라이언트에 응답 보내기 (JSON 형식으로 응답)
    $response = array("status" => "success", "message" => "사용자 정보가 성공적으로 저장되었습니다.");
    echo json_encode($response);
} else {
    // 잘못된 요청에 대한 응답
    header('HTTP/1.1 400 Bad Request');
    echo "잘못된 요청입니다.";
}
?>
