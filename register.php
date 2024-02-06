<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $userid = $_POST["userid"];
    $password = password_hash($_POST["pwd1"], PASSWORD_DEFAULT); // 비밀번호 해시화
    $fullname = $_POST["fullname"];
    $email = $_POST["email"];
    $tel = $_POST["tel"];
    $level = $_POST["level"];

    // 유효성 검사를 수행할 수 있습니다.

    // 데이터베이스에 사용자 정보 저장 (데이터베이스 및 테이블을 생성해야 합니다)
    $servername = "데이터베이스_서버";
    $username = "데이터베이스_사용자";
    $password_db = "데이터베이스_비밀번호";
    $dbname = "데이터베이스_이름";

    try {
        // PDO 객체 생성
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password_db);

        // 에러 모드 설정
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // 데이터베이스에 데이터 삽입
        $sql = "INSERT INTO users (userid, password, fullname, email, tel, level)
                VALUES (:userid, :password, :fullname, :email, :tel, :level)";
        
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':userid', $userid);
        $stmt->bindParam(':password', $password);
        $stmt->bindParam(':fullname', $fullname);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':tel', $tel);
        $stmt->bindParam(':level', $level);

        $stmt->execute();

        echo "사용자가 성공적으로 등록되었습니다.";
    } catch (PDOException $e) {
        echo "오류: " . $e->getMessage();
    }

    // 연결 닫기
    $conn = null;
}
?>
