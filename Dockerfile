# 最新のUbuntuバージョンを指定
FROM ubuntu:22.04
ENV TZ=Asia/Tokyo

# 必要なツールのインストール
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    curl \
    wget \
    git \
    tzdata \
    iproute2 \
    && apt-get clean

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
&& apt-get install -y nodejs

# open port 3000
EXPOSE 3000
