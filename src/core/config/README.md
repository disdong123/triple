# Configuration rules

### Required

| Name        | Description                   |
| ----------- | ----------------------------- |
| ENV_POSTFIX | .env.\* 에 필요한 변수입니다. |
| APP_ENV     | APP 환경변수                  |

### APP_ENV

APP_ENV 는 프로젝트 내에서 namespace 를 통해 로직의 구분이 필요할 때 사용합니다.

local 에서 실행할 때 APP_ENV 는 항상 local 입니다.

(test 환경에서는 APP_ENV 는 test 입니다.)

### ENV_POSTFIX

ENV_POSTIFX 의 local, dev, prod 는 실제 APP_ENV 와는 무관하며, 단순히 local 에서 실행하길 원하는 ENV 파일을 결정하기 위해 사용합니다.

### MYSQL
