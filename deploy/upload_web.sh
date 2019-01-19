remote_ip="207.148.65.114"
remote_path="/data/www/block_web"
# sftp -b ../app/web/build/index.html -r root@$remote_ip:$remote_path
scp -r ../app/web/build/* root@$remote_ip:$remote_path
