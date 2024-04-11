package com.kob.botrunningsystem.utils;

import java.util.ArrayList;
import java.util.List;

public class Bot implements com.kob.botrunningsystem.utils.BotInterface {
    static class Cell {
        public int x, y;
        public Cell(int x, int y) {
            this.x = x;
            this.y = y;
        }
    }

    private boolean check_tail_increasing(int step) {  // 检测当前回合，蛇的长度是否增加
        if(step <= 10) return true;
        return step % 3 == 1;
    }

    public List<Cell> getCells(int sx, int sy, String steps) {
        steps = steps.substring(1, steps.length()-1);  // 去掉左括号
        List<Cell> res = new ArrayList<>();  //删除蛇尾LinkedList（双向链表） 可以O(1)得到尾巴, ArrayList O(n)

        int[] dx = {-1, 0, 1, 0}, dy = {0, 1, 0, -1};
        int x = sx, y = sy;
        int step = 0;
        res.add(new Cell(x, y));
        for(int i=0; i<steps.length(); i++) {
            int d = steps.charAt(i) - '0';
            x += dx[d];
            y += dy[d];
            res.add(new Cell(x, y));
            if(!check_tail_increasing( ++step )) {
                res.remove(0);
            }
        }

        return res;
    }

    @Override
    public Integer nextMove(String input) {
        String[] strs = input.split("#");  // 以"#"编码的那串信息
        int[][] g = new int[13][14];
        for(int i=0, k=0; i<13; i++) {
            for(int j=0; j<14; j++, k++) {
                if(strs[0].charAt(k) == '1') {
                    g[i][j] = 1;
                }
            }
        }

        int aSx = Integer.parseInt(strs[1]), aSy = Integer.parseInt(strs[2]);
        int bSx = Integer.parseInt(strs[4]), bSy = Integer.parseInt(strs[5]);

        List<Cell> aCells = getCells(aSx, aSy, strs[3]);
        List<Cell> bCells = getCells(bSx, bSy, strs[6]);

//        把两条蛇走过的路径标记一下
        for(Cell c: aCells) g[c.x][c.y] = 1;
        for(Cell c: bCells) g[c.x][c.y] = 1;

        int[] dx = {-1, 0, 1, 0}, dy = {0, 1, 0, -1};
        for(int i=0; i<4; i++) {  //判断周围的一个格子能不能走
            int x = aCells.get(aCells.size() - 1).x + dx[i];
            int y = bCells.get(bCells.size() - 1).y + dy[i];
            if(x>=0 && x<13 && y>=0 && y<14 && g[x][y]==0) {
                return i;
            }
        }

        return 0;

    }
}
