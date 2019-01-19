systemctl enable blockapp-server.service
systemctl enable btc-block-sync.service
systemctl enable nginx.service
systemctl daemon-reload

systemctl start blockapp-server.service
systemctl start btc-block-sync.service
systemctl start nginx.service

