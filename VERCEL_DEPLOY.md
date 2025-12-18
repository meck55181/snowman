# Vercel 무료 배포 가이드

이 프로젝트를 Vercel에 무료로 배포하는 방법입니다.

## 사전 준비사항

1. **GitHub 계정** (필수)
2. **Vercel 계정** (무료)
3. **Supabase 계정** (무료)

---

## 1단계: GitHub에 코드 업로드

### 로컬 Git 저장소가 없는 경우:

```bash
# Git 저장소 초기화
git init

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit"

# GitHub에서 새 저장소를 생성한 후
git remote add origin https://github.com/yourusername/snowman.git
git branch -M main
git push -u origin main
```

### 이미 GitHub 저장소가 있는 경우:

```bash
git add .
git commit -m "Ready for deployment"
git push
```

---

## 2단계: Vercel 계정 생성 및 로그인

1. [vercel.com](https://vercel.com) 접속
2. **Sign Up** 클릭
3. **Continue with GitHub** 선택 (GitHub 계정으로 로그인 권장)
4. GitHub 권한 승인

---

## 3단계: 프로젝트 배포

### 방법 1: Vercel 웹사이트에서 배포 (추천)

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. **Add New...** → **Project** 클릭
3. GitHub 저장소 선택 (또는 GitLab/Bitbucket)
4. 프로젝트 선택:
   - **Import Git Repository**에서 `snowman` 프로젝트 찾기
   - 또는 저장소 URL 직접 입력
5. 프로젝트 설정:
   - **Framework Preset**: Next.js (자동 감지됨)
   - **Root Directory**: `./` (기본값 유지)
   - **Build Command**: `next build` (기본값)
   - **Output Directory**: `.next` (기본값)
   - **Install Command**: `npm install` (기본값)

---

## 4단계: 환경 변수 설정

**중요**: Supabase 환경 변수를 반드시 설정해야 합니다!

### Step 1: Supabase에서 값 찾기

1. [Supabase Dashboard](https://app.supabase.com) 접속
2. 프로젝트 선택 (없으면 새 프로젝트 생성)
3. 좌측 사이드바에서 **Settings** (⚙️ 아이콘) 클릭
4. **API** 메뉴 클릭
5. 다음 두 값을 찾아서 복사해두세요:
   - **Project URL** - 예: `https://abcdefghijklmnop.supabase.co`
   - **Project API keys** 섹션의 **anon public** 키 - 예: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (긴 문자열)

### Step 2: Vercel에 환경 변수 입력하기

**방법 A: 프로젝트 배포 전에 설정 (추천)**

1. Vercel 프로젝트 배포 화면에서 **Environment Variables** 섹션 찾기
   - 화면 하단에 있는 경우가 많습니다
2. 첫 번째 환경 변수 추가:
   - **Key** 입력란에: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value** 입력란에: Supabase에서 복사한 **Project URL** 붙여넣기
   - 오른쪽 체크박스에서 **Production**, **Preview** 체크
   - **Add** 또는 **Save** 버튼 클릭
3. 두 번째 환경 변수 추가:
   - **Key** 입력란에: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value** 입력란에: Supabase에서 복사한 **anon public** 키 붙여넣기
   - 오른쪽 체크박스에서 **Production**, **Preview** 체크
   - **Add** 또는 **Save** 버튼 클릭

**방법 B: 이미 배포한 후 설정하는 경우**

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 배포한 프로젝트 클릭
3. 상단 메뉴에서 **Settings** 클릭
4. 좌측 사이드바에서 **Environment Variables** 클릭
5. 환경 변수 추가:
   - **Key**: `NEXT_PUBLIC_SUPABASE_URL` 입력
   - **Value**: Supabase Project URL 붙여넣기
   - **Environment**: Production, Preview 체크
   - **Add** 버튼 클릭
6. 다시 한 번:
   - **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY` 입력
   - **Value**: Supabase anon key 붙여넣기
   - **Environment**: Production, Preview 체크
   - **Add** 버튼 클릭
7. **Redeploy** 버튼 클릭하여 재배포 (환경 변수가 적용되도록)

---

## 5단계: 배포 실행

1. 환경 변수 설정 완료 후 **Deploy** 버튼 클릭
2. 배포 과정 약 1-3분 소요
3. 배포 완료 시 성공 메시지와 함께 배포 URL 확인 가능

---

## 배포 후 확인사항

### ✅ 배포 성공 확인:
- Vercel에서 "Ready" 상태 확인
- 제공된 URL로 접속 테스트
- 콘솔에서 오류 확인 (F12 개발자 도구)

### 🔍 문제 해결:

**빌드 실패 시:**
- Vercel 로그 확인: 프로젝트 → **Deployments** → 실패한 배포 → **Build Logs**
- 환경 변수가 올바르게 설정되었는지 확인
- 로컬에서 `npm run build` 테스트

**환경 변수 오류:**
- Vercel 대시보드에서 환경 변수 재확인
- 변수명 철자 확인 (대소문자 구분)
- 배포 재시도 (환경 변수 변경 후 자동 재배포됨)

---

## Vercel CLI를 사용한 배포 (선택사항)

터미널에서 직접 배포하고 싶다면:

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 프로젝트 디렉토리에서 배포
vercel

# 프로덕션 배포
vercel --prod
```

---

## 무료 플랜 제한사항

Vercel 무료 플랜(Hobby)에서는:
- ✅ 무제한 프로젝트
- ✅ 자동 HTTPS
- ✅ 전 세계 CDN
- ✅ 자동 배포 (Git Push 시)
- ✅ 환경 변수 설정 가능
- ⚠️ 월 100GB 대역폭
- ⚠️ 함수 실행 시간 제한 (10초)

대부분의 개인 프로젝트에는 충분합니다!

---

## 자동 배포 설정

GitHub에 코드를 푸시하면 자동으로 재배포됩니다:

```bash
git add .
git commit -m "Update feature"
git push
```

Vercel이 자동으로 변경사항을 감지하고 새 배포를 시작합니다.

---

## 도메인 연결 (선택사항)

무료 플랜에서도 커스텀 도메인 연결 가능:

1. Vercel 프로젝트 → **Settings** → **Domains**
2. 원하는 도메인 입력
3. DNS 설정 가이드 따라하기

---

## 참고 자료

- [Vercel 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Supabase 문서](https://supabase.com/docs)

