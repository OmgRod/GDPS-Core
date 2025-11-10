-- CreateTable
CREATE TABLE "acccomments" (
    "commentID" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "userName" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "secret" TEXT NOT NULL DEFAULT 'unused',
    "timestamp" INTEGER NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "isSpam" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "acccomments_pkey" PRIMARY KEY ("commentID")
);

-- CreateTable
CREATE TABLE "accounts" (
    "accountID" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "gjp2" TEXT,
    "email" TEXT NOT NULL,
    "isAdmin" INTEGER NOT NULL DEFAULT 0,
    "mS" INTEGER NOT NULL DEFAULT 0,
    "frS" INTEGER NOT NULL DEFAULT 0,
    "cS" INTEGER NOT NULL DEFAULT 0,
    "youtubeurl" TEXT NOT NULL DEFAULT '',
    "twitter" TEXT NOT NULL DEFAULT '',
    "twitch" TEXT NOT NULL DEFAULT '',
    "salt" TEXT NOT NULL DEFAULT '',
    "registerDate" INTEGER NOT NULL DEFAULT 0,
    "friendsCount" INTEGER NOT NULL DEFAULT 0,
    "discordID" BIGINT NOT NULL DEFAULT 0,
    "discordLinkReq" BIGINT NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("accountID")
);

-- CreateTable
CREATE TABLE "actions" (
    "ID" SERIAL NOT NULL,
    "type" INTEGER NOT NULL DEFAULT 0,
    "value" TEXT NOT NULL DEFAULT '0',
    "timestamp" INTEGER NOT NULL DEFAULT 0,
    "value2" TEXT NOT NULL DEFAULT '0',
    "value3" INTEGER NOT NULL DEFAULT 0,
    "value4" INTEGER NOT NULL DEFAULT 0,
    "value5" INTEGER NOT NULL DEFAULT 0,
    "value6" INTEGER NOT NULL DEFAULT 0,
    "account" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "actions_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "actions_downloads" (
    "id" SERIAL NOT NULL,
    "levelID" INTEGER NOT NULL,
    "ip" BYTEA,
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "actions_downloads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actions_likes" (
    "id" SERIAL NOT NULL,
    "itemID" INTEGER NOT NULL,
    "type" INTEGER NOT NULL DEFAULT 0,
    "isLike" BOOLEAN NOT NULL DEFAULT false,
    "ip" BYTEA,
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "actions_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bannedips" (
    "ID" SERIAL NOT NULL,
    "IP" TEXT NOT NULL DEFAULT '127.0.0.1',

    CONSTRAINT "bannedips_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "blocks" (
    "ID" SERIAL NOT NULL,
    "person1" INTEGER NOT NULL,
    "person2" INTEGER NOT NULL,

    CONSTRAINT "blocks_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "comments" (
    "commentID" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "userName" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "secret" TEXT NOT NULL DEFAULT 'none',
    "levelID" INTEGER NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "percent" INTEGER NOT NULL DEFAULT 0,
    "isSpam" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("commentID")
);

-- CreateTable
CREATE TABLE "cpshares" (
    "shareID" SERIAL NOT NULL,
    "levelID" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,

    CONSTRAINT "cpshares_pkey" PRIMARY KEY ("shareID")
);

-- CreateTable
CREATE TABLE "dailyfeatures" (
    "feaID" SERIAL NOT NULL,
    "levelID" INTEGER NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "type" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "dailyfeatures_pkey" PRIMARY KEY ("feaID")
);

-- CreateTable
CREATE TABLE "friendreqs" (
    "ID" SERIAL NOT NULL,
    "accountID" INTEGER NOT NULL,
    "toAccountID" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "uploadDate" INTEGER NOT NULL,
    "isNew" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "friendreqs_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "friendships" (
    "ID" SERIAL NOT NULL,
    "person1" INTEGER NOT NULL,
    "person2" INTEGER NOT NULL,
    "isNew1" INTEGER NOT NULL,
    "isNew2" INTEGER NOT NULL,

    CONSTRAINT "friendships_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "gauntlets" (
    "ID" SERIAL NOT NULL,
    "level1" INTEGER NOT NULL,
    "level2" INTEGER NOT NULL,
    "level3" INTEGER NOT NULL,
    "level4" INTEGER NOT NULL,
    "level5" INTEGER NOT NULL,

    CONSTRAINT "gauntlets_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "levels" (
    "levelID" SERIAL NOT NULL,
    "gameVersion" INTEGER NOT NULL,
    "binaryVersion" INTEGER NOT NULL DEFAULT 0,
    "userName" TEXT NOT NULL,
    "levelName" TEXT NOT NULL,
    "levelDesc" TEXT NOT NULL,
    "levelVersion" INTEGER NOT NULL,
    "levelLength" INTEGER NOT NULL DEFAULT 0,
    "audioTrack" INTEGER NOT NULL,
    "auto" INTEGER NOT NULL,
    "password" INTEGER NOT NULL,
    "original" INTEGER NOT NULL,
    "twoPlayer" INTEGER NOT NULL DEFAULT 0,
    "songID" INTEGER NOT NULL DEFAULT 0,
    "songIDs" TEXT NOT NULL DEFAULT '',
    "sfxIDs" TEXT NOT NULL DEFAULT '',
    "objects" INTEGER NOT NULL DEFAULT 0,
    "coins" INTEGER NOT NULL DEFAULT 0,
    "requestedStars" INTEGER NOT NULL DEFAULT 0,
    "extraString" TEXT NOT NULL,
    "levelString" TEXT,
    "levelInfo" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "starDifficulty" INTEGER NOT NULL DEFAULT 0,
    "downloads" INTEGER NOT NULL DEFAULT 300,
    "likes" INTEGER NOT NULL DEFAULT 100,
    "starDemon" INTEGER NOT NULL,
    "starAuto" BOOLEAN NOT NULL DEFAULT false,
    "starStars" INTEGER NOT NULL DEFAULT 0,
    "uploadDate" BIGINT NOT NULL,
    "updateDate" BIGINT NOT NULL,
    "rateDate" BIGINT NOT NULL DEFAULT 0,
    "starCoins" INTEGER NOT NULL DEFAULT 0,
    "starFeatured" INTEGER NOT NULL DEFAULT 0,
    "starHall" INTEGER NOT NULL DEFAULT 0,
    "starEpic" INTEGER NOT NULL DEFAULT 0,
    "starDemonDiff" INTEGER NOT NULL DEFAULT 0,
    "userID" INTEGER NOT NULL,
    "extID" TEXT NOT NULL,
    "unlisted" INTEGER NOT NULL,
    "originalReup" INTEGER NOT NULL DEFAULT 0,
    "hostname" TEXT NOT NULL,
    "isCPShared" INTEGER NOT NULL DEFAULT 0,
    "isDeleted" INTEGER NOT NULL DEFAULT 0,
    "isLDM" INTEGER NOT NULL DEFAULT 0,
    "unlisted2" INTEGER NOT NULL DEFAULT 0,
    "wt" INTEGER NOT NULL DEFAULT 0,
    "wt2" INTEGER NOT NULL DEFAULT 0,
    "ts" INTEGER NOT NULL DEFAULT 0,
    "settingsString" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "levels_pkey" PRIMARY KEY ("levelID")
);

-- CreateTable
CREATE TABLE "levelscores" (
    "scoreID" SERIAL NOT NULL,
    "accountID" INTEGER NOT NULL,
    "levelID" INTEGER NOT NULL,
    "percent" INTEGER NOT NULL,
    "uploadDate" INTEGER NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "coins" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "time" INTEGER NOT NULL DEFAULT 0,
    "progresses" TEXT NOT NULL,
    "dailyID" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "levelscores_pkey" PRIMARY KEY ("scoreID")
);

-- CreateTable
CREATE TABLE "links" (
    "ID" SERIAL NOT NULL,
    "accountID" INTEGER NOT NULL,
    "targetAccountID" INTEGER NOT NULL,
    "server" TEXT NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,
    "targetUserID" INTEGER NOT NULL,

    CONSTRAINT "links_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "lists" (
    "listID" SERIAL NOT NULL,
    "listName" TEXT NOT NULL,
    "listDesc" TEXT NOT NULL,
    "listVersion" INTEGER NOT NULL,
    "accountID" INTEGER NOT NULL,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "starDifficulty" INTEGER NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "starFeatured" INTEGER NOT NULL DEFAULT 0,
    "starStars" INTEGER NOT NULL DEFAULT 0,
    "listlevels" TEXT NOT NULL,
    "countForReward" INTEGER NOT NULL DEFAULT 0,
    "uploadDate" INTEGER NOT NULL DEFAULT 0,
    "updateDate" INTEGER NOT NULL DEFAULT 0,
    "original" INTEGER NOT NULL DEFAULT 0,
    "unlisted" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "lists_pkey" PRIMARY KEY ("listID")
);

-- CreateTable
CREATE TABLE "mappacks" (
    "ID" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "levels" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "coins" INTEGER NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "rgbcolors" TEXT NOT NULL,
    "colors2" TEXT NOT NULL DEFAULT 'none',

    CONSTRAINT "mappacks_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "messages" (
    "messageID" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "userName" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "accID" INTEGER NOT NULL,
    "toAccountID" INTEGER NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "secret" TEXT NOT NULL DEFAULT 'unused',
    "isNew" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("messageID")
);

-- CreateTable
CREATE TABLE "modactions" (
    "ID" SERIAL NOT NULL,
    "type" INTEGER NOT NULL DEFAULT 0,
    "value" TEXT NOT NULL DEFAULT '0',
    "timestamp" INTEGER NOT NULL DEFAULT 0,
    "value2" TEXT NOT NULL DEFAULT '0',
    "value3" INTEGER NOT NULL DEFAULT 0,
    "value4" TEXT NOT NULL DEFAULT '0',
    "value5" INTEGER NOT NULL DEFAULT 0,
    "value6" INTEGER NOT NULL DEFAULT 0,
    "account" INTEGER NOT NULL DEFAULT 0,
    "value7" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "modactions_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "modipperms" (
    "categoryID" SERIAL NOT NULL,
    "actionFreeCopy" INTEGER NOT NULL,

    CONSTRAINT "modipperms_pkey" PRIMARY KEY ("categoryID")
);

-- CreateTable
CREATE TABLE "modips" (
    "ID" SERIAL NOT NULL,
    "IP" TEXT NOT NULL,
    "isMod" INTEGER NOT NULL,
    "accountID" INTEGER NOT NULL,
    "modipCategory" INTEGER NOT NULL,

    CONSTRAINT "modips_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "platscores" (
    "ID" SERIAL NOT NULL,
    "accountID" INTEGER NOT NULL DEFAULT 0,
    "levelID" INTEGER NOT NULL DEFAULT 0,
    "time" INTEGER NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 0,
    "timestamp" INTEGER NOT NULL,

    CONSTRAINT "platscores_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "quests" (
    "ID" SERIAL NOT NULL,
    "type" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "reward" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "quests_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "reports" (
    "ID" SERIAL NOT NULL,
    "levelID" INTEGER NOT NULL,
    "hostname" TEXT NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "roleassign" (
    "assignID" BIGSERIAL NOT NULL,
    "roleID" BIGINT NOT NULL,
    "accountID" BIGINT NOT NULL,

    CONSTRAINT "roleassign_pkey" PRIMARY KEY ("assignID")
);

-- CreateTable
CREATE TABLE "roles" (
    "roleID" BIGSERIAL NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "roleName" TEXT NOT NULL,
    "commandRate" INTEGER NOT NULL DEFAULT 0,
    "commandFeature" INTEGER NOT NULL DEFAULT 0,
    "commandEpic" INTEGER NOT NULL DEFAULT 0,
    "commandUnepic" INTEGER NOT NULL DEFAULT 0,
    "commandVerifycoins" INTEGER NOT NULL DEFAULT 0,
    "commandDaily" INTEGER NOT NULL DEFAULT 0,
    "commandWeekly" INTEGER NOT NULL DEFAULT 0,
    "commandDelete" INTEGER NOT NULL DEFAULT 0,
    "commandSetacc" INTEGER NOT NULL DEFAULT 0,
    "commandRenameOwn" INTEGER NOT NULL DEFAULT 1,
    "commandRenameAll" INTEGER NOT NULL DEFAULT 0,
    "commandPassOwn" INTEGER NOT NULL DEFAULT 1,
    "commandPassAll" INTEGER NOT NULL DEFAULT 0,
    "commandDescriptionOwn" INTEGER NOT NULL DEFAULT 1,
    "commandDescriptionAll" INTEGER NOT NULL DEFAULT 0,
    "commandPublicOwn" INTEGER NOT NULL DEFAULT 1,
    "commandPublicAll" INTEGER NOT NULL DEFAULT 0,
    "commandUnlistOwn" INTEGER NOT NULL DEFAULT 1,
    "commandUnlistAll" INTEGER NOT NULL DEFAULT 0,
    "commandSharecpOwn" INTEGER NOT NULL DEFAULT 1,
    "commandSharecpAll" INTEGER NOT NULL DEFAULT 0,
    "commandSongOwn" INTEGER NOT NULL DEFAULT 1,
    "commandSongAll" INTEGER NOT NULL DEFAULT 0,
    "profilecommandDiscord" INTEGER NOT NULL DEFAULT 1,
    "actionRateDemon" INTEGER NOT NULL DEFAULT 0,
    "actionRateStars" INTEGER NOT NULL DEFAULT 0,
    "actionRateDifficulty" INTEGER NOT NULL DEFAULT 0,
    "actionRequestMod" INTEGER NOT NULL DEFAULT 0,
    "actionSuggestRating" INTEGER NOT NULL DEFAULT 0,
    "actionDeleteComment" INTEGER NOT NULL DEFAULT 0,
    "toolLeaderboardsban" INTEGER NOT NULL DEFAULT 0,
    "toolPackcreate" INTEGER NOT NULL DEFAULT 0,
    "toolQuestsCreate" INTEGER NOT NULL DEFAULT 0,
    "toolModactions" INTEGER NOT NULL DEFAULT 0,
    "toolSuggestlist" INTEGER NOT NULL DEFAULT 0,
    "dashboardModTools" INTEGER NOT NULL DEFAULT 0,
    "modipCategory" INTEGER NOT NULL DEFAULT 0,
    "isDefault" INTEGER NOT NULL DEFAULT 0,
    "commentColor" TEXT NOT NULL DEFAULT '000,000,000',
    "modBadgeLevel" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("roleID")
);

-- CreateTable
CREATE TABLE "songs" (
    "ID" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "authorID" INTEGER NOT NULL,
    "authorName" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "download" TEXT NOT NULL,
    "hash" TEXT NOT NULL DEFAULT '',
    "isDisabled" INTEGER NOT NULL DEFAULT 0,
    "levelsCount" INTEGER NOT NULL DEFAULT 0,
    "reuploadTime" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "songs_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "suggest" (
    "ID" SERIAL NOT NULL,
    "suggestBy" INTEGER NOT NULL DEFAULT 0,
    "suggestLevelId" INTEGER NOT NULL DEFAULT 0,
    "suggestDifficulty" INTEGER NOT NULL DEFAULT 0,
    "suggestStars" INTEGER NOT NULL DEFAULT 0,
    "suggestFeatured" INTEGER NOT NULL DEFAULT 0,
    "suggestAuto" INTEGER NOT NULL DEFAULT 0,
    "suggestDemon" INTEGER NOT NULL DEFAULT 0,
    "timestamp" INTEGER NOT NULL,

    CONSTRAINT "suggest_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "users" (
    "userID" SERIAL NOT NULL,
    "isRegistered" INTEGER NOT NULL,
    "extID" TEXT NOT NULL,
    "userName" TEXT NOT NULL DEFAULT 'undefined',
    "stars" INTEGER NOT NULL DEFAULT 0,
    "demons" INTEGER NOT NULL DEFAULT 0,
    "icon" INTEGER NOT NULL DEFAULT 0,
    "color1" INTEGER NOT NULL DEFAULT 0,
    "color2" INTEGER NOT NULL DEFAULT 3,
    "color3" INTEGER NOT NULL DEFAULT 0,
    "iconType" INTEGER NOT NULL DEFAULT 0,
    "coins" INTEGER NOT NULL DEFAULT 0,
    "userCoins" INTEGER NOT NULL DEFAULT 0,
    "special" INTEGER NOT NULL DEFAULT 0,
    "gameVersion" INTEGER NOT NULL DEFAULT 0,
    "secret" TEXT NOT NULL DEFAULT 'none',
    "accIcon" INTEGER NOT NULL DEFAULT 0,
    "accShip" INTEGER NOT NULL DEFAULT 0,
    "accBall" INTEGER NOT NULL DEFAULT 0,
    "accBird" INTEGER NOT NULL DEFAULT 0,
    "accDart" INTEGER NOT NULL DEFAULT 0,
    "accRobot" INTEGER DEFAULT 0,
    "accGlow" INTEGER NOT NULL DEFAULT 0,
    "accSwing" INTEGER NOT NULL DEFAULT 0,
    "accJetpack" INTEGER NOT NULL DEFAULT 0,
    "dinfo" TEXT NOT NULL DEFAULT '',
    "sinfo" TEXT NOT NULL DEFAULT '',
    "pinfo" TEXT NOT NULL DEFAULT '',
    "creatorPoints" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "IP" TEXT NOT NULL DEFAULT '127.0.0.1',
    "lastPlayed" INTEGER NOT NULL DEFAULT 0,
    "diamonds" INTEGER NOT NULL DEFAULT 0,
    "moons" INTEGER NOT NULL DEFAULT 0,
    "orbs" INTEGER NOT NULL DEFAULT 0,
    "completedLvls" INTEGER NOT NULL DEFAULT 0,
    "accSpider" INTEGER NOT NULL DEFAULT 0,
    "accExplosion" INTEGER NOT NULL DEFAULT 0,
    "chest1time" INTEGER NOT NULL DEFAULT 0,
    "chest2time" INTEGER NOT NULL DEFAULT 0,
    "chest1count" INTEGER NOT NULL DEFAULT 0,
    "chest2count" INTEGER NOT NULL DEFAULT 0,
    "isBanned" INTEGER NOT NULL DEFAULT 0,
    "isCreatorBanned" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "users_pkey" PRIMARY KEY ("userID")
);
