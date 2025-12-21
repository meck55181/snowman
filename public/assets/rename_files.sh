#!/bin/bash

# 파일명을 코드에서 사용하는 해시값으로 변경

# 로고 파일
[ -f "Group 239.svg" ] && mv "Group 239.svg" "4b737a59b34927c932bd0bcc16fbcd62978292b6.svg" && echo "✓ 연말 결산 로고"
[ -f "Group 239-1.svg" ] && mv "Group 239-1.svg" "d680040e57e3146b77c6e459b741b224b1bd5fcb.svg" && echo "✓ 연말정산 로고"

# 아이콘 파일
[ -f "Vector.svg" ] && mv "Vector.svg" "b0d2c79f53b836588667a1c43cb5cf37d3c5563b.svg" && echo "✓ 상단 왼쪽 아이콘"
[ -f "Group 236.svg" ] && mv "Group 236.svg" "10f6f129c67e5cdbc9e02af1dd96f1719624de84.svg" && echo "✓ Group 225"
[ -f "Group 239.svg" ] && mv "Group 239.svg" "c4a5f30a21a93bc14e229b54b0feb54c9778e529.svg" && echo "✓ Group 226" || echo "⚠ Group 239.svg가 이미 변경되었습니다"
[ -f "Group 232.svg" ] && mv "Group 232.svg" "09f01a3d3a3014f6124c040de9397d511a27f10a.svg" && echo "✓ Group 232"

# 사람 이미지 - man 1, 2, 3은 모두 같은 파일 사용
[ -f "man 1.png" ] && cp "man 1.png" "c8bdd116d3c4a84abefc09e8666ed38e8991bd15.png" && echo "✓ man 1,2,3"
[ -f "man (2) 1.png" ] && mv "man (2) 1.png" "8518a8fe65a2e7beedb844a206042ab586e2fc05.png" && echo "✓ man (2) 1"

# 화살표 이미지
[ -f "Arrow 7.svg" ] && mv "Arrow 7.svg" "61a5c07473a8ccd00d5696556c154563bff18310.svg" && echo "✓ Arrow 7"
[ -f "Arrow 8.svg" ] && mv "Arrow 8.svg" "5ac43280902121d2474e319f8c96aaf0ff04c712.svg" && echo "✓ Arrow 8"
[ -f "Arrow 9.svg" ] && mv "Arrow 9.svg" "bbfd2a48e94e74f7512ec2f38a97650b6ef94794.svg" && echo "✓ Arrow 9"
[ -f "Arrow 13.svg" ] && mv "Arrow 13.svg" "be52adc08ab42865f61605453ded2c74ae0fdc44.svg" && echo "✓ Arrow 13"
[ -f "Arrow 10.svg" ] && mv "Arrow 10.svg" "9041dcc8461eb2bc9e2a205f5744082cda7aa3e5.svg" && echo "✓ Arrow 10,11,12"
[ -f "Arrow 11.svg" ] && rm "Arrow 11.svg" && echo "✓ Arrow 11 제거 (Arrow 10과 동일)"
[ -f "Arrow 12.svg" ] && rm "Arrow 12.svg" && echo "✓ Arrow 12 제거 (Arrow 10과 동일)"
[ -f "Arrow 14.svg" ] && mv "Arrow 14.svg" "94ece428f2c2c23cb174231e670b3f79a7faaa20.svg" && echo "✓ Arrow 14"

# Vector 파일들 확인
[ -f "Vector-1.svg" ] && echo "⚠ Vector-1.svg는 사용되지 않습니다"
[ -f "Vector-2.svg" ] && echo "⚠ Vector-2.svg는 사용되지 않습니다"

# man 2, man 3 파일 확인
[ -f "man 2.png" ] && echo "⚠ man 2.png는 사용되지 않습니다 (man 1.png와 동일)"
[ -f "man 3.png" ] && echo "⚠ man 3.png는 사용되지 않습니다 (man 1.png와 동일)"

echo ""
echo "파일명 변경 완료!"
