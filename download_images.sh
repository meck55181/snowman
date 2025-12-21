#!/bin/bash

# 필요한 이미지 파일들을 다운로드하는 스크립트
# Figma에서 제공한 localhost:3845 URL에서 이미지를 가져옵니다

BASE_URL="http://localhost:3845/assets"
ASSETS_DIR="public/assets"

mkdir -p "$ASSETS_DIR"

# 이미지 파일 목록
declare -a images=(
  "4b737a59b34927c932bd0bcc16fbcd62978292b6.svg"
  "d680040e57e3146b77c6e459b741b224b1bd5fcb.svg"
  "b0d2c79f53b836588667a1c43cb5cf37d3c5563b.svg"
  "10f6f129c67e5cdbc9e02af1dd96f1719624de84.svg"
  "c4a5f30a21a93bc14e229b54b0feb54c9778e529.svg"
  "09f01a3d3a3014f6124c040de9397d511a27f10a.svg"
  "c8bdd116d3c4a84abefc09e8666ed38e8991bd15.png"
  "8518a8fe65a2e7beedb844a206042ab586e2fc05.png"
  "61a5c07473a8ccd00d5696556c154563bff18310.svg"
  "5ac43280902121d2474e319f8c96aaf0ff04c712.svg"
  "bbfd2a48e94e74f7512ec2f38a97650b6ef94794.svg"
  "be52adc08ab42865f61605453ded2c74ae0fdc44.svg"
  "9041dcc8461eb2bc9e2a205f5744082cda7aa3e5.svg"
  "5b39ddf94d9b5d1b479825b6cf6e3d4de50eb7e7.svg"
  "94ece428f2c2c23cb174231e670b3f79a7faaa20.svg"
)

echo "이미지 다운로드를 시작합니다..."
for img in "${images[@]}"; do
  echo "다운로드 중: $img"
  curl -s "$BASE_URL/$img" -o "$ASSETS_DIR/$img" || echo "실패: $img"
done

echo "완료!"
