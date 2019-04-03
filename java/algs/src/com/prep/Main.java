package com.prep;

import java.util.Random;

public class Main {

    protected static int membersCount = 10;

    protected static class LogEntry {
        String timeStamp = "time";
        int member1;
        int member2;
    }

    protected static LogEntry readLogLine() {
        LogEntry logEntry = new LogEntry();
        Random rand = new Random();
        logEntry.member1 = rand.nextInt(membersCount);
        logEntry.member2 = rand.nextInt(membersCount);
        return logEntry;
    }

    public static void main(String[] args) {
        FScan fscan = new FScan(membersCount);
        int logRecords = 50;
        for (int i = 0; i < logRecords; i++) {
            LogEntry logEntry = readLogLine();
            fscan.union(logEntry.member1, logEntry.member2);
            int max1 = fscan.find(logEntry.member1);
            int max2 = fscan.find(logEntry.member2);
            if (fscan.allFriends())
                System.out.print(logEntry.timeStamp);
        }
    }
}
