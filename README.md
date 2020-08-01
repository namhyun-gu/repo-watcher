# repo-watcher

> 리포지토리 변경 내역을 알려주는 스크립트

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/7e37d420f8dc415a96ae3dd788af2555)](https://www.codacy.com/manual/namhyun-gu/repo-watcher?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=namhyun-gu/repo-watcher&amp;utm_campaign=Badge_Grade)

## 사용방법

1. 새로운 공개 Gist를 생성합니다. (https://gist.github.com/)
2. 만들어진 Gist의 URL에서 gist id 값을 복사합니다. (https://gist.github.com/{사용자 명}/{gist id})
3. Gist에 파일을 추가하고 다음 내용을 추가합니다.
```yaml
lang: ko # ko 혹은 en
notification:
  mail: # 메일로 알림을 받을 경우 추가
    smtpService: Naver # smtp 서비스명 
    smtpHost: smpt.naver.com # smtp 호스트 주소
    smtpPort: 587 # smtp 포트번호
    senderMail: # 발신자 메일 주소
    receiverMail: # 수신자 메일 주소
targets:  # 알림을 받을 Repository
  - namhyun-gu/repo-watcher
  - ...
```
4. 이 리포지토리를 포크합니다.
5. 포크한 리포지토리에서 **Settings > Secrets** 로 이동합니다.
6. **New Secrets**을 통해 다음 환경변수를 추가합니다.
   - **GIST_ID**: 앞서 복사한 gist id
   - **SMTP_USER**: 메일로 알림을 받을 경우, SMTP에 로그인하기 위한 아이디
   - **SMTP_PW**: 메일로 알림을 받을 경우, SMTP에 로그인하기 위한 비밀번호
7. 앞선 과정에 문제가 없다면 오전 9시마다 추가한 알림 방식으로 하루 전날까지 추가된 커밋 내역을 알려줍니다.
   - 오전 9시가 아닌 다른 시간을 지정하려면 ```.github/workflows/run.yml``` 파일의 ```schedule > cron``` 값을 수정하면 변경할 수 있습니다. (Github Actions은 UTC를 기준으로 하기에 지정할 시간에 9시간을 뺀 값으로 변경하면 됩니다.)