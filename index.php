<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 데이터베이스 연결 및 입력값 가져오기
    $uid = $_POST["uid"];
    $umail = $_POST["umail"];
    $pwd1 = $_POST["pwd1"];
    $pwd2 = $_POST["pwd2"];
    $mailing = $_POST["mailing"];

    // 데이터베이스 연결 정보 설정 (아래 정보를 실제 데이터베이스 정보로 변경해야 합니다)
    $servername = "your_servername"; // 예: localhost
    $username = "your_username";
    $password = "your_password";
    $dbname = "your_database";

    // 데이터베이스 연결
    $conn = new mysqli($servername, $username, $password, $dbname);

    // 연결 확인
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // 비밀번호 해싱 (보안을 위해 사용자 비밀번호를 해싱하여 저장하는 것이 좋습니다)
    $hashed_pwd = password_hash($pwd1, PASSWORD_DEFAULT);

    // 사용자 정보를 데이터베이스에 저장하는 INSERT 쿼리
    $sql = "INSERT INTO users (uid, umail, password, mailing)
            VALUES ('$uid', '$umail', '$hashed_pwd', '$mailing')";

    if ($conn->query($sql) === TRUE) {
        echo "회원 가입이 완료되었습니다.";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    // 데이터베이스 연결 종료
    $conn->close();
}
?>
