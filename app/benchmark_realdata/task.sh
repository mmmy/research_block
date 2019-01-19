base_dir="/root/workspace/research_block/app/benchmark_realdata"
mkdir "${base_dir}/temp"
# 爬虫同步最新ssq求数据
python3 "${base_dir}/main.py"
# 区块链生成数据
node "${base_dir}/../server/sync_benchmark.js"
# 生成图表和csv
python3 "${base_dir}/statistic_ssq.py"

# copy
target_dri="/data/www/block_web/benchmark"
mkdir $target_dri
chmod 777 $target_dri

cp -r "${base_dir}/temp/*" $target_dri
