<template>
  <div id="wrapper">
    <div class="md-layout md-alignment-center-left">
      <div class="md-layout-item md-size-30">
        <md-field>
          <label for="country">설정</label>
          <md-select :value="selected" @md-selected="selectInstagram" name="country" id="country" md-dense>
            <md-option v-for="(setting, index) in this.$store.state.instagram.settings.filter(item => item.name)" :value="setting.id" :key="index">{{setting.name}}</md-option>
          </md-select>
        </md-field>
      </div>
      <div class="" style="margin-left: 10px;">
        <md-button class="weather-pink" @click="showConfirm"><span class="weather-pink">삭제하기</span></md-button>
        <md-button class="weather-pink" @click="showSettingDialog = true"><span class="weather-pink">추가하기</span></md-button>
      </div>
    </div>
    <main v-if="$store.state.instagram.selectedSetting">
      <div>
        <md-radio v-model="$store.state.instagram.selectedSetting.followType" :value="1" @change="changeFollowType" :disabled="true">선팔로우 + 언팔로우</md-radio>
        <md-radio v-model="$store.state.instagram.selectedSetting.followType" :value="2" @change="changeFollowType" :disabled="true">친구관리</md-radio>
        <md-radio v-model="$store.state.instagram.selectedSetting.followType" :value="3" @change="changeFollowType" :disabled="true">언팔로우</md-radio>
      </div>

      <div class="detail-setting" v-if="$store.state.instagram.selectedSetting.followType === 1">
        <div class="md-layout">
          <div class="md-layout-item">
            <md-field>
              <label>맞팔 안받을시 팔로우취소 기간</label>
              <md-input :value="$store.state.instagram.selectedSetting.mutualFollowingTimeout" @input="changeMutualFollowingTimeout" type="number"></md-input>
              <div class="md-helper-text">맞팔 안받을시 팔로우취소 기간 ex) 3 입력시, 3일간 맞팔을 안받아줄 경우 다시 언팔함.</div>
            </md-field>
          </div>
        </div>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <label>해시태그당 작업횟수</label>
              <md-input :value="$store.state.instagram.selectedSetting.processingCountPerTag" @input="changeProcessingCountPerTag" type="number"></md-input>
              <div class="md-helper-text">태그당 작업횟수.</div>
            </md-field>
          </div>
          <div class="md-layout-item">
            <md-field>
              <label>작업간격 (초)</label>
              <md-input :value="$store.state.instagram.selectedSetting.processingInterval" @input="changeProcessInterval" type="number"></md-input>
              <div class="md-helper-text">권장값 30초 이상</div>
            </md-field> 
          </div>
          <div class="md-layout-item">
            <md-field>
              <label>작업 확률</label>
              <md-input :value="$store.state.instagram.selectedSetting.processingProbability" type="number" @input="changeProcessingProbability"></md-input>
              <div class="md-helper-text">인간처럼 행동하기 위한 장치</div>
            </md-field>
          </div>
        </div>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <label>팔로우/언팔로우 하루 제한횟수</label>
              <md-input :value="$store.state.instagram.selectedSetting.followLimitPerDay" @input="changeFollowLimitPerDay" type="number"></md-input>
              <div class="md-helper-text"></div>
            </md-field>
          </div>
          <div class="md-layout-item">
            <md-field>
              <label>좋아요 하루 제한횟수</label>
              <md-input :value="$store.state.instagram.selectedSetting.likeLimitPerDay" @input="changeLikeLimitPerDay" type="number"></md-input>
              <div class="md-helper-text"></div>
            </md-field>
          </div>
          <div class="md-layout-item">
            <md-field>
              <label>댓글 하루 제한횟수</label>
              <md-input :value="$store.state.instagram.selectedSetting.commentLimitPerDay" @input="changeCommentLimitPerDay" type="number"></md-input>
              <div class="md-helper-text"></div>
            </md-field>
          </div>
        </div>
      </div>


      <div class="detail-setting" v-if="$store.state.instagram.selectedSetting.followType === 2">
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <label for="country">팔로우 관리순서</label>
              <md-select :value="followerOrder" md-dense @md-selected="changeFollowerOrder">
                <md-option v-for="(option, index) in followerOrderOptions" :value="option.value" :disabled="option.disabled" :key="index">{{option.text}}</md-option>
              </md-select>
              <div class="md-helper-text">팔로워 관리순서</div>
            </md-field>
          </div>
          <div class="md-layout-item">
            <md-field>
              <label>팔로워당 좋아요 작업갯수</label>
              <md-input :value="$store.state.instagram.selectedSetting.likePerFollower" @input="changeLikePerFollower" type="number"></md-input>
              <div class="md-helper-text">팔로워 1명마다 눌러주는 좋아요 갯수</div>
            </md-field>
          </div>
          <div class="md-layout-item">
            <md-field>
              <label>팔로워당 댓글 작업갯수</label>
              <md-input :value="$store.state.instagram.selectedSetting.commentPerFollower" @input="changeCommentPerFollower" type="number"></md-input>
              <div class="md-helper-text">팔로워 1명마다 달아주는 댓글 갯수</div>
            </md-field>
          </div>
        </div>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <label>작업간격 (초)</label>
              <md-input :value="$store.state.instagram.selectedSetting.processingInterval" @input="changeProcessInterval" type="number"></md-input>
              <div class="md-helper-text">권장값 35초 이상</div>
            </md-field>
          </div>
          <div class="md-layout-item">
            <md-field>
              <label>좋아요 하루 제한횟수</label>
              <md-input :value="$store.state.instagram.selectedSetting.likeLimitPerDay" @input="changeLikeLimitPerDay" type="number"></md-input>
              <div class="md-helper-text"></div>
            </md-field>
          </div>
          <div class="md-layout-item">
            <md-field>
              <label>댓글 하루 제한횟수</label>
              <md-input :value="$store.state.instagram.selectedSetting.commentLimitPerDay" @input="changeCommentLimitPerDay" type="number"></md-input>
              <div class="md-helper-text"></div>
            </md-field>
          </div>
        </div>
      </div>

      <div class="detail-setting" v-if="$store.state.instagram.selectedSetting.followType === 3">
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <label for="country">언팔로우 타입</label>
              <md-select v-model="unfollowType" md-dense @md-selected="changeUnfollowType">
                <md-option v-for="(option, index) in unfollowTypeOptions" :value="option.value" :key="index">{{option.text}}</md-option>
              </md-select>
              <div class="md-helper-text">언팔로우 타입</div>
            </md-field>
          </div>
          <div class="md-layout-item">
            <md-field>
              <label>작업간격 (초)</label>
              <md-input :value="$store.state.instagram.selectedSetting.processingInterval" @input="changeProcessInterval" type="number"></md-input>
              <div class="md-helper-text">권장값 40초 이상</div>
            </md-field>
          </div>
          <div class="md-layout-item">
            <md-field>
              <label>언팔로우 하루 제한횟수</label>
              <md-input :value="$store.state.instagram.selectedSetting.followLimitPerDay" @input="changeFollowLimitPerDay" type="number"></md-input>
              <div class="md-helper-text">언팔로우 하루 제한횟수</div>
            </md-field>
          </div>
        </div>
      </div>


      <md-switch v-model="showTag" v-if="$store.state.instagram.selectedSetting.followType === 1">태그설정 숨기기</md-switch>
      <div class="md-layout-item" v-if="showTag && $store.state.instagram.selectedSetting.followType === 1">
        <md-field>
          <label>타겟태그 추가</label>
          <md-input v-model="inputTargetTag" @keyup.enter="addTargetTag" type="text"></md-input>
          <div class="md-helper-text">입력된 태그를 검색하여 해당태그에 관심있는 사용자에게 작업을 시도합니다. (한번에 여러태그를 입력려면 콤마(,) 로 구분하여 입력)</div>
        </md-field>
      </div>

      <div v-if="showTag && $store.state.instagram.selectedSetting.followType === 1" style="padding-top: 10px;">
        <md-chip class="md-primary" md-deletable v-for="(tag, index) in $store.state.instagram.selectedSetting.targetTags" :key="index" @md-delete="removeTargetTag(tag)" style="marginBottom: 4px;">{{tag}}</md-chip>
      </div>

      <div class="md-layout-item" v-if="showTag && $store.state.instagram.selectedSetting.followType === 1">
        <md-field>
          <label>블랙태그 추가</label>
          <md-input v-model="inputBlackTag" @keyup.enter="addBlackTag" type="text"></md-input>
          <div class="md-helper-text">작업하려는 포스팅에 블랙태그가 존재할 경우. 팔로우 좋아요 댓글 작업에 제외 됩니다. (한번에 여러태그를 입력려면 콤마(,) 로 구분하여 입력)</div>
        </md-field>
      </div>

      <div v-if="showTag && $store.state.instagram.selectedSetting.followType === 1" style="padding-top: 10px; margin-bottom:10px;">
        <md-chip @click="showDefaultSpamDialog = true" md-clickable>기본 스팸태그</md-chip>
        <md-chip class="md-accent" md-deletable v-for="(tag, index) in $store.state.instagram.selectedSetting.blackTags" :key="index" @md-delete="removeBlackTag(tag)">{{tag}}</md-chip>
      </div>

      <div class="md-layout-item" v-if="showTag && $store.state.instagram.selectedSetting.followType === 3">
        <md-field>
          <label>언팔제외 유저추가</label>
          <md-input v-model="inputTargetUser" @keyup.enter="addTargetUser" type="text"></md-input>
          <div class="md-helper-text">언팔제외 유저는 언팔로우 작업에서 제외됩니다.</div>
        </md-field>
      </div>

      <div v-if="showTag && $store.state.instagram.selectedSetting.followType === 3" style="padding-top: 10px;">
        <md-chip class="md-primary" md-deletable v-for="(user, index) in $store.state.instagram.selectedSetting.targetUsers" :key="index" @md-delete="removeTargetUser(user)" style="marginBottom: 4px;">{{user}}</md-chip>
      </div>

      <md-switch v-model="showComment" v-if="$store.state.instagram.selectedSetting.followType !== 3">댓글설정 숨기기</md-switch>
      <div class="margin-bottom-30" v-if="$store.state.instagram.selectedSetting.followType !== 3 && showComment">
        <md-radio v-model="commentType" :value="0" @change="changeCommentType">간편댓글 사용하기</md-radio>
        <md-radio v-model="commentType" :value="1" @change="changeCommentType">상세댓글 사용하기</md-radio>
        <md-radio v-model="commentType" :value="2" @change="changeCommentType">둘다 사용하기</md-radio>
        <div class="md-subheader" v-if="commentType === 2"> * 간편댓글과 상세댓글을 둘다 적용하는 기능이며 상세댓글이 적용되지 않을경우 간편댓글을 적용합니다.</div>
        <div class="md-subheader" v-if="commentType === 1 || commentType === 2"> * 상세댓글이란 상대방 피드의 내용을 분석하여 포함하는 태그, 포함하지않는 태그(지정가능 태그갯수 무제한)를 지정하여<br> 댓글을 더 구체적으로 등록할 수 있는 기능입니다. </div>
        <div class="md-layout md-gutter" v-if="commentType === 1 || commentType === 2">
          <div class="md-layout-item md-size-30">
            <md-list class="md-dense">
              <md-list-item class="md-primary" :style="{backgroundColor: '#fab1ce'}">
                <span :style="{color: 'white'}">상세댓글 규칙</span>
                <md-button class="md-icon-button md-list-action"></md-button>
              </md-list-item>
              <div v-for="(rule, index) in $store.state.instagram.selectedSetting.commentRules" :key="index">
                <md-list-item class="md-layout" @click="selectCommentRule(rule.id)" :style="(rule.id === selectedCommentRule) ? {backgroundColor: '#e7e7e7'} : {}">
                  <div class="md-layout-item">{{(rule.name.length > 6) ? `${rule.name.slice(0, 6)}...` : rule.name}}</div>
                  <md-badge class="md-square md-warning" md-content="이미지" style="background-color: rgb(250, 177, 206)" v-if="rule.useImageTags && rule.imageTags.length > 0" />&nbsp;
                  <md-badge class="md-square md-primary" md-content="포함" v-if="rule.includeTags.length > 0" />&nbsp;
                  <md-badge class="md-square" md-content="제외" v-if="rule.excludeTags.length > 0" />&nbsp;
                  <md-badge class="md-square" :md-content="rule.comments.length" style="background-color: #a7a7a7;" />&nbsp;
                </md-list-item>
                <md-divider></md-divider>
              </div>
              <div>
                <md-list-item class="md-layout">
                  <div class="md-layout-item">
                    <input type="text" v-model="ruleName" placeholder="규칙이름" class="weather-input" @keyup.enter="addCommentRule">
                  </div>
                  <md-button class="md-icon-button md-list-action" @click="addCommentRule">
                    <md-icon :style="{color: 'black'}">add</md-icon>
                  </md-button>
                </md-list-item>
                <md-divider></md-divider>
              </div>
            </md-list>
          </div>
  
          <div class="md-layout-item" v-if="selectedCommentRules">
            <div>
              <md-list class="md-dense">
                <md-list-item class="md-primary" :style="{backgroundColor: '#fab1ce', color: 'white'}">
                  <span :style="{color: 'white'}">{{selectedCommentRules.name}}</span>
                  <md-button class="md-icon-button md-list-action" @click="removeCommentRuleDialog = true">
                    <md-icon :style="{color: 'black'}">remove</md-icon>
                  </md-button>
                </md-list-item>
                <md-list-item class="md-layout">
                  <md-checkbox :disabled="true" v-model="selectedCommentRules.useImageTags"/>
                  <span class="md-list-item-text" style="line-height: normal;">이미지 분류태그 사용하기</span>
                </md-list-item>
                <md-list-item class="md-layout">
                  <span class="md-list-item-text">이미지분류 태그는 오차가 존재하며 이미지분류가 되지않는 포스팅에는 작업하지 않습니다.</span>
                </md-list-item>
                <md-divider></md-divider>            
              </md-list>
            </div>
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-size-50">
                <md-list class="md-dense">
                <md-list-item class="md-primary" :style="{backgroundColor: '#fab1ce', color: 'white'}">
                  <span :style="{color: 'white'}">포함 단어</span>
                </md-list-item>
                <div v-for="(tag, index) in selectedCommentRules.includeTags" :key="index">
                  <md-list-item class="md-layout">
                    <div class="md-layout-item">
                      <span class="md-list-item-text">{{tag}} </span>
                    </div>
                    <md-button class="md-icon-button md-list-action" @click="removeCommentRuleIncludeTag(tag)">
                      <md-icon :style="{color: 'black'}">remove</md-icon>
                    </md-button>
                  </md-list-item>
                  <md-divider></md-divider>
                </div>
                <div>
                  <md-list-item class="md-layout">
                    <div class="md-layout-item">
                      <input type="text" v-model="ruleIncludeTag" class="weather-input" @keyup.enter="addCommentRuleIncludeTag">
                    </div>
                    <md-button class="md-icon-button md-list-action" @click="addCommentRuleIncludeTag">
                      <md-icon :style="{color: 'black'}">add</md-icon>
                    </md-button>
                  </md-list-item>
                  <md-divider></md-divider>
                </div>
              </md-list>
              </div>
              <div class="md-layout-item md-size-50">
                <md-list class="md-dense">
                  <md-list-item class="md-primary" :style="{backgroundColor: '#fab1ce', color: 'white'}">
                    <span :style="{color: 'white'}">제외 단어</span>
                  </md-list-item>
                  <div v-for="(tag, index) in selectedCommentRules.excludeTags" :key="index">
                    <md-list-item class="md-layout">
                      <div class="md-layout-item">
                        <span class="md-list-item-text">{{tag}}</span>
                      </div>
                      <md-button class="md-icon-button md-list-action" @click="removeCommentRuleExcludeTag(tag)">
                        <md-icon :style="{color: 'black'}">remove</md-icon>
                      </md-button>
                    </md-list-item>
                    <md-divider></md-divider>
                  </div>
                  <div>
                    <md-list-item class="md-layout">
                      <div class="md-layout-item">
                        <input type="text" v-model="ruleExcludeTag" class="weather-input" @keyup.enter="addCommentRuleExcludeTag">
                      </div>
                      <md-button class="md-icon-button md-list-action" @click="addCommentRuleExcludeTag">
                        <md-icon :style="{color: 'black'}">add</md-icon>
                      </md-button>
                    </md-list-item>
                    <md-divider></md-divider>
                  </div>
                </md-list>
              </div>
            </div>
            <md-list class="md-dense">
              <md-list-item class="md-primary" :style="{backgroundColor: '#fab1ce', color: 'white'}">
                <span :style="{color: 'white'}">응답 댓글 목록 (이모티콘 입력은 아직 지원하지 않습니다.) </span>
              </md-list-item>
              <div v-for="(comment, index) in selectedCommentRules.comments" :key="index">
                <md-list-item class="md-layout">
                  <div class="md-layout-item">
                    <span class="md-list-item-text">{{comment}}</span>
                  </div>
                  <md-button class="md-icon-button md-list-action" @click="removeCommentRuleComment(comment)">
                    <md-icon :style="{color: 'black'}">remove</md-icon>
                  </md-button>
                </md-list-item>
                <md-divider></md-divider>
              </div>
              <div>
                <md-list-item class="md-layout">
                  <div class="md-layout-item">
                    <input type="text" v-model="ruleComment" class="weather-input" @keyup.enter="addCommentRuleComment">
                  </div>
                  <md-button class="md-icon-button md-list-action" @click="addCommentRuleComment">
                    <md-icon :style="{color: 'black'}">add</md-icon>
                  </md-button>
                </md-list-item>
                <md-divider></md-divider>
              </div>
            </md-list>
          </div>
        </div>

        <div class="md-subheader" v-if="commentType === 0 || commentType === 2"> * 간편댓글이란 상대방 피드에 올린 태그에 따라 응답할 댓글을 결정하는 기능입니다.</div>
        <div class="md-layout md-gutter" v-if="commentType === 0 || commentType === 2">
          <div class="md-layout-item md-size-30">
            <md-list class="md-dense">
              <md-list-item class="md-primary" :style="{backgroundColor: '#fab1ce'}">
                <span :style="{color: 'white'}">댓글 타겟 태그</span>
                <md-button class="md-icon-button md-list-action"></md-button>
              </md-list-item>
              <div v-for="(auco, index) in $store.state.instagram.selectedSetting.autoComments" :key="index">
                <md-list-item class="md-layout" @click="selectAutoComment(auco.id)" :style="(auco.id === selectedAutoComment) ? {backgroundColor: '#e7e7e7'} : {}">
                  <div class="md-layout-item" :style="(auco.keyword === '!default') ? {color: '#448AFF'} : {}">{{auco.keyword}}</div>
                  <div class="">{{auco.comments.length}}</div>
                  <md-button class="md-icon-button md-list-action" v-if="auco.keyword !== '!default'" @click="deleteAutoComment(auco.id)">
                    <md-icon :style="{color: 'black'}">remove</md-icon>
                  </md-button>
                  <md-button class="md-icon-button md-list-action" v-if="auco.keyword === '!default'">
                    <md-icon :style="{color: 'red'}"></md-icon>
                  </md-button>
                </md-list-item>
                <md-divider></md-divider>
              </div>
              <div>
                <md-list-item class="md-layout">
                  <div class="md-layout-item">
                    <input type="text" v-model="keyword" class="weather-input" @keyup.enter="addAutoComment">
                  </div>
                  <md-button class="md-icon-button md-list-action" @click="addAutoComment">
                    <md-icon :style="{color: 'black'}">add</md-icon>
                  </md-button>
                </md-list-item>
                <md-divider></md-divider>
              </div>
            </md-list>
          </div>

          <div class="md-layout-item"  v-if="selectedAutoComments">
            <md-list class="md-dense">
              <md-list-item class="md-primary" :style="{backgroundColor: '#fab1ce', color: 'white'}">
                <span :style="{color: 'white'}">응답 댓글 목록 (이모티콘 입력은 아직 지원하지 않습니다.) </span>
                <md-button class="md-icon-button md-list-action"></md-button>
              </md-list-item>
              <div v-for="(comment, index) in selectedAutoComments.comments" :key="index">
                <md-list-item class="md-layout">
                  <div class="md-layout-item">
                    <span class="md-list-item-text">{{comment}}</span>
                  </div>
                  <md-button class="md-icon-button md-list-action" @click="removeAutoCommentComment(comment)">
                    <md-icon :style="{color: 'black'}">remove</md-icon>
                  </md-button>
                </md-list-item>
                <md-divider></md-divider>
              </div>
              <div>
                <md-list-item class="md-layout">
                  <div class="md-layout-item">
                    <input type="text" v-model="comment" class="weather-input" @keyup.enter="addAutoCommentComment">
                  </div>
                  <md-button class="md-icon-button md-list-action" @click="addAutoCommentComment">
                    <md-icon :style="{color: 'black'}">add</md-icon>
                  </md-button>
                </md-list-item>
                <md-divider></md-divider>
              </div>
            </md-list>
          </div>
        </div>
      </div>

      <md-switch v-model="showActiveTime">작동시간 설정 숨기기</md-switch>
      <div class="md-layout md-gutter md-alignment-center-center" v-if="showActiveTime">
        <md-list class="md-layout-item">
          <md-subheader>
            <md-checkbox v-model="activeTime1" @change="changeActiveTime(1)" />
            <span class="md-list-item-text">새벽</span>
          </md-subheader>
          <md-list-item>
            <md-checkbox v-model="activeTimes" @change="changeActiveTimes" :value="0" />
            <span class="md-list-item-text">00:00 ~ 01:00</span>
          </md-list-item>

          <md-list-item>
            <md-checkbox v-model="activeTimes" @change="changeActiveTimes" :value="1" />
            <span class="md-list-item-text">01:00 ~ 02:00</span>
          </md-list-item>

          <md-list-item>
            <md-checkbox v-model="activeTimes" @change="changeActiveTimes" :value="2" />
            <span class="md-list-item-text">02:00 ~ 03:00</span>
          </md-list-item>

          <md-list-item>
            <md-checkbox v-model="activeTimes" @change="changeActiveTimes" :value="3" />
            <span class="md-list-item-text">03:00 ~ 04:00</span>
          </md-list-item>

          <md-list-item>
            <md-checkbox v-model="activeTimes" @change="changeActiveTimes" :value="4" />
            <span class="md-list-item-text">04:00 ~ 05:00</span>
          </md-list-item>

          <md-list-item>
            <md-checkbox v-model="activeTimes" @change="changeActiveTimes" :value="5" />
            <span class="md-list-item-text">05:00 ~ 06:00</span>
          </md-list-item>
        </md-list>

        <md-list class="md-layout-item">
          <md-subheader>
            <md-checkbox v-model="activeTime2" @change="changeActiveTime(2)"/>
            <span class="md-list-item-text">오전</span>
          </md-subheader>
          <md-list-item>
            <md-checkbox v-model="activeTimes" @change="changeActiveTimes" :value="6" />
            <span class="md-list-item-text">06:00 ~ 07:00</span>
          </md-list-item>

          <md-list-item>
            <md-checkbox v-model="activeTimes" @change="changeActiveTimes" :value="7" />
            <span class="md-list-item-text">07:00 ~ 08:00</span>
          </md-list-item>

          <md-list-item>
            <md-checkbox v-model="activeTimes" @change="changeActiveTimes" :value="8" />
            <span class="md-list-item-text">08:00 ~ 09:00</span>
          </md-list-item>

          <md-list-item>
            <md-checkbox v-model="activeTimes" @change="changeActiveTimes" :value="9" />
            <span class="md-list-item-text">09:00 ~ 10:00</span>
          </md-list-item>

          <md-list-item>
            <md-checkbox v-model="activeTimes" @change="changeActiveTimes" :value="10" />
            <span class="md-list-item-text">10:00 ~ 11:00</span>
          </md-list-item>

          <md-list-item>
            <md-checkbox v-model="activeTimes" @change="changeActiveTimes" :value="11" />
            <span class="md-list-item-text">11:00 ~ 12:00</span>
          </md-list-item>
        </md-list>

        <md-list class="md-layout-item">
          <md-subheader>
            <md-checkbox v-model="activeTime3" @change="changeActiveTime(3)"/>
            <span class="md-list-item-text">오후</span>
          </md-subheader>
          <md-list-item>
            <md-checkbox v-model="activeTimes" @change="changeActiveTimes" :value="12" />
            <span class="md-list-item-text">12:00 ~ 13:00</span>
          </md-list-item>

          <md-list-item>
            <md-checkbox v-model="activeTimes" @change="changeActiveTimes" :value="13" />
            <span class="md-list-item-text">13:00 ~ 14:00</span>
          </md-list-item>

          <md-list-item>
            <md-checkbox v-model="activeTimes" @change="changeActiveTimes" :value="14" />
            <span class="md-list-item-text">14:00 ~ 15:00</span>
          </md-list-item>

          <md-list-item>
            <md-checkbox v-model="activeTimes" @change="changeActiveTimes" :value="15" />
            <span class="md-list-item-text">15:00 ~ 16:00</span>
          </md-list-item>

          <md-list-item>
            <md-checkbox v-model="activeTimes" @change="changeActiveTimes" :value="16" />
            <span class="md-list-item-text">16:00 ~ 17:00</span>
          </md-list-item>

          <md-list-item>
            <md-checkbox v-model="activeTimes" @change="changeActiveTimes" :value="17" />
            <span class="md-list-item-text">17:00 ~ 18:00</span>
          </md-list-item>
        </md-list>

        <md-list class="md-layout-item">
          <md-subheader>
            <md-checkbox v-model="activeTime4" @change="changeActiveTime(4)"/>
            <span class="md-list-item-text">저녁</span>
          </md-subheader>
          <md-list-item>
            <md-checkbox v-model="activeTimes" @change="changeActiveTimes" :value="18" />
            <span class="md-list-item-text">18:00 ~ 19:00</span>
          </md-list-item>

          <md-list-item>
            <md-checkbox v-model="activeTimes" @change="changeActiveTimes" :value="19" />
            <span class="md-list-item-text">19:00 ~ 20:00</span>
          </md-list-item>

          <md-list-item>
            <md-checkbox v-model="activeTimes" @change="changeActiveTimes" :value="20" />
            <span class="md-list-item-text">20:00 ~ 21:00</span>
          </md-list-item>

          <md-list-item>
            <md-checkbox v-model="activeTimes" @change="changeActiveTimes" :value="21" />
            <span class="md-list-item-text">21:00 ~ 22:00</span>
          </md-list-item>

          <md-list-item>
            <md-checkbox v-model="activeTimes" @change="changeActiveTimes" :value="22" />
            <span class="md-list-item-text">22:00 ~ 23:00</span>
          </md-list-item>

          <md-list-item>
            <md-checkbox v-model="activeTimes" @change="changeActiveTimes" :value="23" />
            <span class="md-list-item-text">23:00 ~ 24:00</span>
          </md-list-item>
        </md-list>
      </div>
    </main>
    <div>
      <md-dialog-confirm
        :md-active.sync="confirmActive"
        md-title="소셜업"
        :md-content="`${(this.$store.state.instagram.selectedSetting) ? this.$store.state.instagram.selectedSetting.name : ''} 설정을 삭제하시겠습니까? 삭제이후엔 복구할 수 없습니다.`"
        md-confirm-text="삭제하기"
        md-cancel-text="취소하기"
        @md-confirm="deleteInstagram" />
    </div>
    <div>
      <md-dialog md-fullscreen
        :md-active.sync="showDefaultSpamDialog">
        <md-dialog-title>기본 스팸태그</md-dialog-title>
        <md-dialog-content class="weather-content">
          <span>* 기본스팸태그란 소셜업에서 직접 지정한 스팸태그로써 작업시<br> 어떠한 팔로우 설정을 하든 상관없이 제일먼저 검사되는 태그입니다.</span><br>
          <div style="padding-top: 10px;">
            <md-chip class="md-accent" md-deletable v-for="(tag, index) in $store.state.flag.defaultSpamTag" :key="index" @md-delete="removeDefaultSpamTag(tag)">{{tag}}</md-chip>
          </div>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button class="md-primary" @click="clearDefaultSpamTag">기본스팸태그 전체삭제</md-button>
          <md-button class="md-primary" @click="initDefaultSpamTag">기본스팸태그 초기화</md-button>
          <md-button class="" @click="showDefaultSpamDialog = false">닫기</md-button>
        </md-dialog-actions>
      </md-dialog>
    </div>
    <div>
      <md-dialog md-fullscreen
        :md-active.sync="showSettingDialog">
        <md-dialog-title>설정 추가하기</md-dialog-title>
        <md-dialog-content class="weather-content">
          <div>
            <md-radio v-model="selectedType" :value="1">선팔로우 + 언팔로우</md-radio>
          </div>
          <div>
            <md-radio v-model="selectedType" :value="2">친구관리</md-radio>
          </div>
          <div>
            <md-radio v-model="selectedType" :value="3">언팔로우</md-radio>
          </div>
          <md-field>
            <label>설정이름</label>
            <md-input v-model="name" @keyup.enter="createInstagram"></md-input>
            <span class="md-helper-text">자신에게 맞는 설정을 만들수 있습니다.</span>
          </md-field>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button class="" @click="showSettingDialog = false">취소</md-button>
          <md-button class="md-primary" @click="createInstagram">추가</md-button>
        </md-dialog-actions>
      </md-dialog>
    </div>
    <div>
      <md-dialog-confirm
        :md-active.sync="removeCommentRuleDialog"
        :md-title="`상세댓글 규칙 [${(selectedCommentRules) ? selectedCommentRules.name : '선태안됨'}]을 삭제하시겠습니까?`"
        md-content="상세댓글 규칙을 삭제하면 되돌릴 수 없습니다.<br> 그 래도 삭제하시겠습니까?"
        md-confirm-text="삭제"
        md-cancel-text="취소"
        @md-cancel="removeCommentRuleDialog = false"
        @md-confirm="deleteCommentRule((selectedCommentRules) ? selectedCommentRules.id : 0)" />
    </div>
  </div>
</template>

<script>
import * as _ from 'lodash';

export default {
  name: 'follow',
  data() {
    return {
      // eslint-disable-next-line
      selected: (this.$store.state.instagram.selectedSetting) ? this.$store.state.instagram.selectedSetting.id : 0,
      name: '',
      selectedType: 1,
      inputTargetTag: '',
      inputTargetUser: '',
      inputBlackTag: '',
      inputBlackUser: '',
      selectedInstagram: null,
      selectedAutoComment: 0,
      selectedCommentRule: 0,
      showTag: true,
      showActiveTime: true,
      showComment: true,
      keyword: '',
      comment: '',
      confirmActive: false,
      showDefaultSpamDialog: false,
      showSettingDialog: false,
      commentType: null,
      activeTimes: [],
      targetTags: [],
      ruleName: '',
      ruleIncludeTag: '',
      ruleExcludeTag: '',
      ruleComment: '',
      followType: '',
      removeCommentRuleDialog: false,
      activeTime1: false,
      activeTime2: false,
      activeTime3: false,
      activeTime4: false,
      followerOrder: 1,
      followerOrderOptions: [
        { value: 1, text: '맞팔로우', disabled: false },
        { value: 2, text: '팔로워', disabled: false },
        { value: 3, text: '팔로잉', disabled: false },
        { value: 4, text: '시크릿팬 (상대방만 팔로우)', disabled: false },
        { value: 5, text: '스타 (나만 팔로우)', disabled: false },
      ],
      unfollowType: 1,
      unfollowTypeOptions: [
        { value: 1, text: '맞팔제외 언팔로우' },
        { value: 2, text: '모두 언팔로우' },
      ],
    };
  },
  computed: {
    selectedAutoComments() {
      if (this.selectedAutoComment === 0) {
        return null;
      }
      // eslint-disable-next-line
      const ret = this.$store.state.instagram.selectedSetting.autoComments.filter(item => item.id === this.selectedAutoComment);
      if (ret && ret.length > 0) {
        return ret[0];
      }
      return null;
    },
    selectedCommentRules() {
      if (this.selectedCommentRule === 0) {
        return null;
      }
      // eslint-disable-next-line
      const ret = this.$store.state.instagram.selectedSetting.commentRules.filter(item => item.id === this.selectedCommentRule);
      if (ret && ret.length > 0) {
        return ret[0];
      }
      return null;
    },
  },
  methods: {
    initDefaultSpamTag() {
      this.$store.dispatch('initDefaultSpamTag');
    },
    clearDefaultSpamTag() {
      this.$store.dispatch('clearDefaultSpamTag');
    },
    removeDefaultSpamTag(tag) {
      this.$store.dispatch('removeDefaultSpamTag', tag);
    },
    showConfirm() {
      if (this.$store.state.instagram.selectedSetting) {
        this.confirmActive = true;
      }
    },
    selectInstagram(index) {
      const selected = this.$store.state.instagram.settings.filter(item => item.id === index)[0];
      this.$store.dispatch('selectSetting', selected);
      if (selected) {
        this.followType = selected.followType;
        this.commentType = selected.commentType;
        this.activeTimes = _.cloneDeep(selected.activeTimes);
        const defaultAC = selected.autoComments.filter(item => item.keyword === '!default')[0];
        if (defaultAC) {
          this.selectAutoComment(defaultAC.id);
        }
      }
    },
    deleteInstagram() {
      this.$http.delete(`api/instagram/${this.$store.state.instagram.selectedSetting.id}`).then((response) => {
        if (response.data) {
          this.$store.dispatch('removeSetting', this.$store.state.instagram.selectedSetting.id);
          this.selectInstagram(0);
          this.selected = 0;
        }
      });
    },
    createInstagram() {
      if (!this.name) {
        return;
      }
      this.$http.post('api/instagram', {
        name: this.name,
        followType: this.selectedType,
      }).then((response) => {
        if (response.data) {
          this.$store.dispatch('addSetting', response.data);
          this.selectInstagram(response.data.id);
          this.selected = response.data.id;
          this.name = '';
          this.showSettingDialog = false;
        }
      });
    },
    changeCommentType(value) {
      this.$http.put(`api/instagram/${this.$store.state.instagram.selectedSetting.id}/comment-type`, {
        commentType: value,
      }).then((response) => {
        if (response.data) {
          this.$store.dispatch('updateCommentType', {
            id: this.$store.state.instagram.selectedSetting.id,
            commentType: value,
          });
        }
      });
    },
    changeFollowType(value) {
      this.$http.put(`api/instagram/${this.$store.state.instagram.selectedSetting.id}/follow-type`, {
        followType: value,
      }).then((response) => {
        if (response.data) {
          this.$store.dispatch('updateFollowType', {
            id: this.$store.state.instagram.selectedSetting.id,
            followType: value,
          });
        }
      });
    },
    addTargetTag() {
      const tagString = this.inputTargetTag.replace('#', '');
      this.inputTargetTag = '';
      this.$http.post(`api/instagram/${this.$store.state.instagram.selectedSetting.id}/target-tag`, {
        targetTag: tagString,
      }).then((response) => {
        if (response.data) {
          const tags = tagString.split(',');
          tags.forEach((item) => {
            const tag = item.trim();
            if (tag && !this.$store.state.instagram.selectedSetting.targetTags.filter(item => item === tag)[0]) {
              this.$store.dispatch('addTargetTag', {
                id: this.$store.state.instagram.selectedSetting.id,
                value: tag,
              });
            }
          });
        }
      });
    },
    removeTargetTag(value) {
      this.$http.delete(`api/instagram/${this.$store.state.instagram.selectedSetting.id}/target-tag`, {
        params: {
          targetTag: value,
        },
      }).then((response) => {
        if (response.data) {
          this.$store.dispatch('removeTargetTag', {
            id: this.$store.state.instagram.selectedSetting.id,
            value,
          });
        }
      });
    },
    addBlackTag() {
      const tagString = this.inputBlackTag.replace('#', '');
      this.inputBlackTag = '';
      this.$http.post(`api/instagram/${this.$store.state.instagram.selectedSetting.id}/black-tag`, {
        blackTag: tagString,
      }).then((response) => {
        if (response.data) {
          const tags = tagString.split(',');
          tags.forEach((item) => {
            const tag = item.trim();
            if (tag && !this.$store.state.instagram.selectedSetting.blackTags.filter(item => item === tag)[0]) {
              this.$store.dispatch('addBlackTag', {
                id: this.$store.state.instagram.selectedSetting.id,
                value: tag,
              });
            }
          });
        }
      });
    },
    removeBlackTag(value) {
      this.$http.delete(`api/instagram/${this.$store.state.instagram.selectedSetting.id}/black-tag`, {
        params: {
          blackTag: value,
        },
      }).then((response) => {
        if (response.data) {
          this.$store.dispatch('removeBlackTag', {
            id: this.$store.state.instagram.selectedSetting.id,
            value,
          });
        }
      });
    },
    addTargetUser() {
      const userString = this.inputTargetUser;
      this.inputTargetUser = '';
      this.$http.post(`api/instagram/${this.$store.state.instagram.selectedSetting.id}/target-user`, {
        targetUser: userString,
      }).then((response) => {
        if (response.data) {
          const users = userString.split(',');
          users.forEach((item) => {
            const user = item.trim();
            if (user && !this.$store.state.instagram.selectedSetting.targetUsers.filter(item => item === user)[0]) {
              this.$store.dispatch('addTargetUser', {
                id: this.$store.state.instagram.selectedSetting.id,
                value: user,
              });
            }
          });
        }
      });
    },
    removeTargetUser(value) {
      this.$http.delete(`api/instagram/${this.$store.state.instagram.selectedSetting.id}/target-user`, {
        params: {
          targetUser: value,
        },
      }).then((response) => {
        if (response.data) {
          this.$store.dispatch('removeTargetUser', {
            id: this.$store.state.instagram.selectedSetting.id,
            value,
          });
        }
      });
    },
    addBlackUser(value) {
      this.$http.post(`api/instagram/${this.$store.state.instagram.selectedSetting.id}/black-user`, {
        blackUser: value,
      }).then((response) => {
        if (response.data) {
          this.$store.dispatch('addBlackUser', {
            id: this.$store.state.instagram.selectedSetting.id,
            value,
          });
        }
      });
    },
    removeBlackUser(value) {
      this.$http.delete(`api/instagram/${this.$store.state.instagram.selectedSetting.id}/black-user`, {
        params: {
          blackUser: value,
        },
      }).then((response) => {
        if (response.data) {
          this.$store.dispatch('removeBlackUser', {
            id: this.$store.state.instagram.selectedSetting.id,
            value,
          });
        }
      });
    },
    changeLikeLimitPerDay(value) {
      if (this.$store.state.instagram.selectedSetting.likeLimitPerDay !== value) {
        this.$http.put(`api/instagram/${this.$store.state.instagram.selectedSetting.id}/like-limit`, {
          likeLimitPerDay: value,
        }).then((response) => {
          if (response.data) {
            this.$store.dispatch('setLikeLimitPerDay', {
              id: this.$store.state.instagram.selectedSetting.id,
              value,
            });
          }
        });
      }
    },
    changeFollowLimitPerDay(value) {
      if (this.$store.state.instagram.selectedSetting.followLimitPerDay !== value) {
        this.$http.put(`api/instagram/${this.$store.state.instagram.selectedSetting.id}/follow-limit`, {
          followLimitPerDay: value,
        }).then((response) => {
          if (response.data) {
            this.$store.dispatch('setFollowLimitPerDay', {
              id: this.$store.state.instagram.selectedSetting.id,
              value,
            });
          }
        });
      }
    },
    changeCommentLimitPerDay(value) {
      if (this.$store.state.instagram.selectedSetting.commentLimitPerDay !== value) {
        this.$http.put(`api/instagram/${this.$store.state.instagram.selectedSetting.id}/comment-limit`, {
          commentLimitPerDay: value,
        }).then((response) => {
          if (response.data) {
            this.$store.dispatch('setCommentLimitPerDay', {
              id: this.$store.state.instagram.selectedSetting.id,
              value,
            });
          }
        });
      }
    },
    changeProcessingProbability(value) {
      if (this.$store.state.instagram.selectedSetting.processingProbability !== value) {
        this.$http.put(`api/instagram/${this.$store.state.instagram.selectedSetting.id}/processing-probability`, {
          processingProbability: value,
        }).then((response) => {
          if (response.data) {
            this.$store.dispatch('setProcessingProbability', {
              id: this.$store.state.instagram.selectedSetting.id,
              value,
            });
          }
        });
      }
    },
    changeMutualFollowingTimeout(value) {
      if (this.$store.state.instagram.selectedSetting.mutualFollowingTimeout !== value) {
        this.$http.put(`api/instagram/${this.$store.state.instagram.selectedSetting.id}/mutual-following-timeout`, {
          mutualFollowingTimeout: value,
        }).then((response) => {
          if (response.data) {
            this.$store.dispatch('setMutualFollowingTimeout', {
              id: this.$store.state.instagram.selectedSetting.id,
              value,
            });
          }
        });
      }
    },
    changeProcessingCountPerTag(value) {
      if (this.$store.state.instagram.selectedSetting.processingCountPerTag !== value) {
        this.$http.put(`api/instagram/${this.$store.state.instagram.selectedSetting.id}/processing-count-per-tag`, {
          processingCountPerTag: value,
        }).then((response) => {
          if (response.data) {
            this.$store.dispatch('setProcessingCountPerTag', {
              id: this.$store.state.instagram.selectedSetting.id,
              value,
            });
          }
        });
      }
    },
    changeProcessInterval(value) {
      if (this.$store.state.instagram.selectedSetting.processingInterval !== value) {
        this.$http.put(`api/instagram/${this.$store.state.instagram.selectedSetting.id}/processing-interval`, {
          processingInterval: value,
        }).then((response) => {
          if (response.data) {
            this.$store.dispatch('setProcessingInterval', {
              id: this.$store.state.instagram.selectedSetting.id,
              value,
            });
          }
        });
      }
    },
    changeUnfollowType(value) {
      if (this.$store.state.instagram.selectedSetting.unfollowType !== value) {
        this.$http.put(`api/instagram/${this.$store.state.instagram.selectedSetting.id}/unfollow-type`, {
          unfollowType: value,
        }).then((response) => {
          if (response.data) {
            this.$store.dispatch('setUnfollowType', {
              id: this.$store.state.instagram.selectedSetting.id,
              value,
            });
          }
        });
      }
    },
    changeFollowerOrder(value) {
      if (this.$store.state.instagram.selectedSetting.followerOrder !== value) {
        this.$http.put(`api/instagram/${this.$store.state.instagram.selectedSetting.id}/follower-order`, {
          followerOrder: value,
        }).then((response) => {
          if (response.data) {
            this.$store.dispatch('setFollowerOrder', {
              id: this.$store.state.instagram.selectedSetting.id,
              value,
            });
          }
        });
      }
    },
    changeLikePerFollower(value) {
      if (this.$store.state.instagram.selectedSetting.likePerFollower !== value) {
        this.$http.put(`api/instagram/${this.$store.state.instagram.selectedSetting.id}/like-per-follower`, {
          likePerFollower: value,
        }).then((response) => {
          if (response.data) {
            this.$store.dispatch('setLikePerFollower', {
              id: this.$store.state.instagram.selectedSetting.id,
              value,
            });
          }
        });
      }
    },
    changeCommentPerFollower(value) {
      if (this.$store.state.instagram.selectedSetting.commentPerFollower !== value) {
        this.$http.put(`api/instagram/${this.$store.state.instagram.selectedSetting.id}/comment-per-follower`, {
          commentPerFollower: value,
        }).then((response) => {
          if (response.data) {
            this.$store.dispatch('setCommentPerFollower', {
              id: this.$store.state.instagram.selectedSetting.id,
              value,
            });
          }
        });
      }
    },
    clearLog() {
      this.$store.dispatch('clearFollowLog');
    },
    changeCommentList(auco) {
      this.commentList = auco.comment;
    },
    addCommentRule() {
      if (!this.ruleName) {
        return;
      }
      if (this.$store.state.instagram.selectedSetting.commentRules.filter(item => item.name === this.ruleName)[0]) {
        this.ruleName = '';
        return;
      }
      const settingId = this.$store.state.instagram.selectedSetting.id;
      this.$http.post(`api/instagram/${settingId}/comment-rule`, {
        name: this.ruleName,
      }).then((response) => {
        if (response.data) {
          this.$store.dispatch('addCommentRule', {
            id: settingId,
            value: response.data,
          });
          this.selectCommentRule(response.data.id);
        }
      });
    },
    deleteCommentRule(ruleId) {
      const settingId = this.$store.state.instagram.selectedSetting.id;
      this.$http.delete(`api/instagram/${settingId}/comment-rule/${ruleId}`).then((response) => {
        if (response.data) {
          this.$store.dispatch('removeCommentRule', {
            id: settingId,
            value: ruleId,
          });
        }
      });
    },
    addCommentRuleIncludeTag() {
      if (!this.ruleIncludeTag) {
        return;
      }
      if (this.selectedCommentRules.includeTags.filter(item => item === this.ruleIncludeTag)[0]) {
        this.ruleIncludeTag = '';
        return;
      }
      const settingId = this.$store.state.instagram.selectedSetting.id;
      const ruleId = this.selectedCommentRule;
      const tag = this.ruleIncludeTag;
      this.ruleIncludeTag = '';
      // eslint-disable-next-line
      this.$http.post(`api/instagram/${settingId}/comment-rule/${ruleId}/include-tag`, {
        tag,
      }).then((response) => {
        if (response.data) {
          this.$store.dispatch('addCommentRuleIncludeTag', {
            id: settingId,
            ruleId,
            value: tag,
          });
        }
      });
    },
    removeCommentRuleIncludeTag(value) {
      const settingId = this.$store.state.instagram.selectedSetting.id;
      const ruleId = this.selectedCommentRule;
      // eslint-disable-next-line
      this.$http.delete(`api/instagram/${settingId}/comment-rule/${ruleId}/include-tag`, {
        params: {
          tag: value,
        },
      }).then((response) => {
        if (response.data) {
          this.$store.dispatch('removeCommentRuleIncludeTag', {
            id: settingId,
            ruleId,
            value,
          });
        }
      });
    },
    addCommentRuleExcludeTag() {
      if (!this.ruleExcludeTag) {
        return;
      }
      if (this.selectedCommentRules.excludeTags.filter(item => item === this.ruleExcludeTag)[0]) {
        this.ruleExcludeTag = '';
        return;
      }
      const settingId = this.$store.state.instagram.selectedSetting.id;
      const ruleId = this.selectedCommentRule;
      const tag = this.ruleExcludeTag;
      this.ruleExcludeTag = '';
      this.$http.post(`api/instagram/${settingId}/comment-rule/${ruleId}/exclude-tag`, {
        tag,
      }).then((response) => {
        if (response.data) {
          this.$store.dispatch('addCommentRuleExcludeTag', {
            id: settingId,
            ruleId,
            value: tag,
          });
        }
      });
    },
    removeCommentRuleExcludeTag(value) {
      const settingId = this.$store.state.instagram.selectedSetting.id;
      const ruleId = this.selectedCommentRule;
      this.$http.delete(`api/instagram/${settingId}/comment-rule/${ruleId}/exclude-tag`, {
        params: {
          tag: value,
        },
      }).then((response) => {
        if (response.data) {
          this.$store.dispatch('removeCommentRuleExcludeTag', {
            id: settingId,
            ruleId,
            value,
          });
        }
      });
    },
    addCommentRuleComment() {
      if (!this.ruleComment) {
        return;
      }
      if (this.selectedCommentRules.excludeTags.filter(item => item === this.ruleComment)[0]) {
        this.ruleComment = '';
        return;
      }
      const settingId = this.$store.state.instagram.selectedSetting.id;
      const ruleId = this.selectedCommentRule;
      const comment = this.ruleComment;
      this.ruleComment = '';
      // eslint-disable-next-line
      this.$http.post(`api/instagram/${settingId}/comment-rule/${ruleId}/comment`, {
        comment,
      }).then((response) => {
        if (response.data) {
          this.$store.dispatch('addCommentRuleComment', {
            id: settingId,
            ruleId,
            value: comment,
          });
        }
      });
    },
    removeCommentRuleComment(value) {
      const settingId = this.$store.state.instagram.selectedSetting.id;
      const ruleId = this.selectedCommentRule;
      this.$http.delete(`api/instagram/${settingId}/comment-rule/${ruleId}/comment`, {
        params: {
          comment: value,
        },
      }).then((response) => {
        if (response.data) {
          this.$store.dispatch('removeCommentRuleComment', {
            id: settingId,
            ruleId,
            value,
          });
        }
      });
    },
    addAutoComment() {
      if (!this.keyword) {
        return;
      }
      this.$http.post(`api/instagram/${this.$store.state.instagram.selectedSetting.id}/auto-comment`, {
        keyword: this.keyword,
      }).then((response) => {
        if (response.data) {
          this.$store.dispatch('addAutoComment', {
            id: this.$store.state.instagram.selectedSetting.id,
            value: response.data,
          });
          this.keyword = '';
          this.selectAutoComment(response.data.id);
        }
      });
    },
    deleteAutoComment(acId) {
      this.$http.delete(`api/instagram/${this.$store.state.instagram.selectedSetting.id}/auto-comment/${acId}`).then((response) => {
        if (response.data) {
          this.$store.dispatch('removeAutoComment', {
            id: this.$store.state.instagram.selectedSetting.id,
            value: acId,
          });
        }
      });
    },
    addAutoCommentComment() {
      if (!this.comment) {
        return;
      }
      // eslint-disable-next-line
      this.$http.post(`api/instagram/${this.$store.state.instagram.selectedSetting.id}/auto-comment/${this.selectedAutoComment}/comment`, {
        comment: this.comment,
      }).then((response) => {
        if (response.data) {
          this.$store.dispatch('addAutoCommentComment', {
            id: this.$store.state.instagram.selectedSetting.id,
            acId: this.selectedAutoComment,
            value: this.comment,
          });
          this.comment = '';
        }
      });
    },
    removeAutoCommentComment(value) {
      // eslint-disable-next-line
      this.$http.delete(`api/instagram/${this.$store.state.instagram.selectedSetting.id}/auto-comment/${this.selectedAutoComment}/comment`, {
        params: {
          comment: value,
        },
      }).then((response) => {
        if (response.data) {
          this.$store.dispatch('removeAutoCommentComment', {
            id: this.$store.state.instagram.selectedSetting.id,
            acId: this.selectedAutoComment,
            value,
          });
        }
      });
    },
    selectAutoComment(value) {
      this.selectedAutoComment = value;
    },
    selectCommentRule(value) {
      this.selectedCommentRule = value;
    },
    changeActiveTime(value) {
      if (value === 1) {
        if (this.activeTime1 === false) {
          this.activeTimes = this.activeTimes.filter(item => item > 5);
        } else {
          const array = [0, 1, 2, 3, 4, 5];
          array.forEach((item) => {
            if (!this.activeTimes.includes(item)) {
              this.activeTimes.push(item);
            }
          });
        }
      } else if (value === 2) {
        if (this.activeTime2 === false) {
          this.activeTimes = this.activeTimes.filter(item => item <= 5 || item > 11);
        } else {
          const array = [6, 7, 8, 9, 10, 11];
          array.forEach((item) => {
            if (!this.activeTimes.includes(item)) {
              this.activeTimes.push(item);
            }
          });
        }
      } else if (value === 3) {
        if (this.activeTime3 === false) {
          this.activeTimes = this.activeTimes.filter(item => item <= 11 || item > 17);
        } else {
          const array = [12, 13, 14, 15, 16, 17];
          array.forEach((item) => {
            if (!this.activeTimes.includes(item)) {
              this.activeTimes.push(item);
            }
          });
        }
      } else if (value === 4) {
        if (this.activeTime4 === false) {
          this.activeTimes = this.activeTimes.filter(item => item < 18);
        } else {
          const array = [18, 19, 20, 21, 22, 23];
          array.forEach((item) => {
            if (!this.activeTimes.includes(item)) {
              this.activeTimes.push(item);
            }
          });
        }
      }
      this.changeActiveTimes();
    },
    changeActiveTimes() {
      this.$http.put(`api/instagram/${this.$store.state.instagram.selectedSetting.id}/active-times`, {
        activeTimes: this.activeTimes,
      }).then((response) => {
        if (response.data) {
          this.$store.dispatch('setActiveTimes', {
            id: this.$store.state.instagram.selectedSetting.id,
            value: this.activeTimes,
          });
        }
      });
    },
    addTime() {
      if (this.startTime >= this.endTime) {
        // alert(`시작시간을 종료시간보다 작게 입력해주세요. 시작: ${this.startTime} - 종료: ${this.endTime}`);
        return;
      }
      this.$store.dispatch('addActiveTime', {
        startTime: this.startTime,
        endTime: this.endTime,
      });
    },
    removeActiveTime(time) {
      this.$store.dispatch('removeActiveTime', time);
    },
    removeAutoComment(comment) {
      this.commentList = [];
      this.$store.dispatch('removeAutoComment', comment);
    },
  },
};
</script>

<style lang="scss" scoped>
.weather-input {
  width: 100%;
}
.margin-bottom-30 {
  margin-bottom: 50px;
}
div.md-checkbox{
  margin-right: 12px !important;
}
.weather-pink {
  background-color: #fab1ce !important;
  color: white;
}
.md-table-row *{
  text-align: center;
}
.font-size-24{
  font-size: 20px;
}
</style>
