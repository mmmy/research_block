base_dir="/root/workspace/research_block/app/benchmark_realdata"
mkdir "${base_dir}/temp"
# 爬虫同步最新ssq求数据
python3 "${base_dir}/main.py"
# 生成图表和csv
python3 "${base_dir}/statistic_ssq.py"

