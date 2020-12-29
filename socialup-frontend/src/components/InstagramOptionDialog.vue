<template>
  <md-dialog
      :md-active.sync="show"
      :md-fullscreen="true"
      :md-click-outside-to-close="false">
      <md-dialog-title>작업설정</md-dialog-title>
      <md-dialog-content class="weather-content">
        <main v-if="setting">
          <div class="md-layout" style="margin-bottom: 10px;">
            <md-radio class="md-layout-item md-small-size-100" v-model="setting.followType" :value="1">선팔로우 + 언팔로우</md-radio>
            <md-radio class="md-layout-item md-small-size-100" v-model="setting.followType" :value="2">친구 관리</md-radio>
            <md-radio class="md-layout-item md-small-size-100" v-model="setting.followType" :value="3">언팔로우</md-radio>
          </div>

          <div class="detail-setting" v-if="setting.followType === 1">
            <div class="md-layout">
              <div class="md-layout-item">
                <md-field>
                  <label>맞팔 안받을시 팔로우취소 기간</label>
                  <md-input v-model="setting.mutualFollowingTimeout" type="number"></md-input>
                  <div class="md-helper-text">ex) 3 입력시, 3일간 맞팔을 받아주지 않을 경우 언팔함.</div>
                </md-field>
              </div>
            </div>
            <div class="md-layout md-gutter">
              <div class="md-layout-item">
                <md-field>
                  <label>해시태그당 작업횟수</label>
                  <md-input v-model="setting.processingCountPerTag" type="number"></md-input>
                  <div class="md-helper-text">태그당 작업횟수.</div>
                </md-field>
              </div>
              <div class="md-layout-item">
                <md-field>
                  <label>작업간격 (초)</label>
                  <md-input v-model="setting.processingInterval" type="number"></md-input>
                  <div class="md-helper-text">권장값 40초 이상</div>
                </md-field> 
              </div>
              <div class="md-layout-item">
                <md-field>
                  <label>작업 확률</label>
                  <md-input v-model="setting.processingProbability" type="number"></md-input>
                  <div class="md-helper-text">권장값 권장 80이상</div>
                </md-field>
              </div>
            </div>
            <div class="md-layout md-gutter">
              <div class="md-layout-item">
                <md-field>
                  <label>팔로우/언팔로우 하루 제한횟수</label>
                  <md-input v-model="setting.followLimitPerDay" type="number"></md-input>
                  <div class="md-helper-text"></div>
                </md-field>
              </div>
              <div class="md-layout-item">
                <md-field>
                  <label>좋아요 하루 제한횟수</label>
                  <md-input v-model="setting.likeLimitPerDay" type="number"></md-input>
                  <div class="md-helper-text"></div>
                </md-field>
              </div>
              <div class="md-layout-item">
                <md-field>
                  <label>댓글 하루 제한횟수</label>
                  <md-input v-model="setting.commentLimitPerDay" type="number"></md-input>
                  <div class="md-helper-text"></div>
                </md-field>
              </div>
            </div>
          </div>


          <div class="detail-setting" v-if="setting.followType === 2">
            <div class="md-layout md-alignment-center-space-between">
              <div class="md-layout-item md-size-30 md-small-size-100">
                <md-field>
                  <label for="country">친구관리 대상</label>
                  <md-select v-model="setting.followerOrder" md-dense>
                    <md-option v-for="(option, index) in followerOrderOptions" :value="option.value" :disabled="option.disabled" :key="index">{{option.text}}</md-option>
                  </md-select>
                  <div class="md-helper-text">친구관리 대상</div>
                </md-field>
              </div>
              <div class="md-layout-item md-size-30 md-small-size-100">
                <md-field>
                  <label>좋아요 작업갯수</label>
                  <md-input v-model="setting.likePerFollower" type="number"></md-input>
                  <div class="md-helper-text">친구 1명마다 눌러주는 좋아요 갯수</div>
                </md-field>
              </div>
              <div class="md-layout-item md-size-30 md-small-size-100">
                <md-field>
                  <label>댓글 작업갯수</label>
                  <md-input v-model="setting.commentPerFollower" type="number"></md-input>
                  <div class="md-helper-text">친구 1명마다 달아주는 댓글 갯수</div>
                </md-field>
              </div>
            </div>
            <div class="md-layout md-gutter">
              <div class="md-layout-item">
                <md-field>
                  <label>작업간격 (초)</label>
                  <md-input v-model="setting.processingInterval" type="number"></md-input>
                  <div class="md-helper-text">권장값 40초 이상</div>
                </md-field>
              </div>
              <div class="md-layout-item">
                <md-field>
                  <label>좋아요 하루 제한횟수</label>
                  <md-input v-model="setting.likeLimitPerDay" type="number"></md-input>
                  <div class="md-helper-text"></div>
                </md-field>
              </div>
              <div class="md-layout-item">
                <md-field>
                  <label>댓글 하루 제한횟수</label>
                  <md-input v-model="setting.commentLimitPerDay" type="number"></md-input>
                  <div class="md-helper-text"></div>
                </md-field>
              </div>
            </div>
          </div>

          <div class="detail-setting" v-if="setting.followType === 3">
            <div class="md-layout md-gutter">
              <div class="md-layout-item">
                <md-field>
                  <label for="country">언팔로우 타입</label>
                  <md-select v-model="setting.unfollowType" md-dense>
                    <md-option v-for="(option, index) in unfollowTypeOptions" :value="option.value" :key="index">{{option.text}}</md-option>
                  </md-select>
                  <div class="md-helper-text">언팔로우 타입</div>
                </md-field>
              </div>
              <div class="md-layout-item">
                <md-field>
                  <label>작업간격 (초)</label>
                  <md-input v-model="setting.processingInterval" type="number"></md-input>
                  <div class="md-helper-text">권장값 40초 이상</div>
                </md-field>
              </div>
              <div class="md-layout-item">
                <md-field>
                  <label>언팔로우 하루 제한횟수</label>
                  <md-input v-model="setting.followLimitPerDay" type="number"></md-input>
                  <div class="md-helper-text">언팔로우 하루 제한횟수</div>
                </md-field>
              </div>
            </div>
          </div>


          <md-switch v-model="showTag" v-if="setting.followType === 1">태그설정 숨기기</md-switch>
          <div class="md-layout-item" v-if="showTag && setting.followType === 1">
            <md-field style="margin: 4px 0 48px;">
              <label>타겟태그 추가</label>
              <md-input v-model="inputTargetTag" @keyup.enter="addTargetTag" type="text"></md-input>
              <div class="md-helper-text">입력된 태그를 검색하여 해당태그에 관심있는 사용자에게 작업을 시도합니다. (여러태그 입력은 , 로 구분)</div>
            </md-field>
          </div>

          <div v-if="showTag && setting.followType === 1" style="padding-top: 10px;">
            <md-chip class="md-primary" md-deletable v-for="(tag, index) in setting.targetTags" :key="index" @md-delete="removeTargetTag(tag)" style="marginBottom: 4px;">{{tag}}</md-chip>
          </div>

          <div class="md-layout-item" v-if="showTag && setting.followType === 1">
            <md-field style="margin: 4px 0 48px;">
              <label>블랙태그 추가</label>
              <md-input v-model="inputBlackTag" @keyup.enter="addBlackTag" type="text"></md-input>
              <div class="md-helper-text">작업하려는 포스팅에 블랙태그가 존재할 경우. 작업에 제외 됩니다. (여러태그 입력은 , 로 구분)</div>
            </md-field>
          </div>

          <div v-if="showTag && setting.followType === 1" style="padding-top: 10px; margin-bottom:10px;">
            <md-chip @click="showDefaultSpamDialog = true" md-clickable>기본 스팸태그</md-chip>
            <md-chip class="md-accent" md-deletable v-for="(tag, index) in setting.blackTags" :key="index" @md-delete="removeBlackTag(tag)" style="marginBottom: 4px;">{{tag}}</md-chip>
          </div>

          <div class="md-layout-item" v-if="showTag && setting.followType === 3">
            <md-field>
              <label>언팔제외 유저추가</label>
              <md-input v-model="inputTargetUser" @keyup.enter="addTargetUser" type="text"></md-input>
              <div class="md-helper-text">언팔제외 유저는 언팔로우 작업에서 제외됩니다.</div>
            </md-field>
          </div>

          <div v-if="showTag && setting.followType === 3" style="padding-top: 10px;">
            <md-chip class="md-primary" md-deletable v-for="(user, index) in setting.targetUsers" :key="index" @md-delete="removeTargetUser(user)" style="marginBottom: 4px;">{{user}}</md-chip>
          </div>

          <md-switch v-model="showComment" v-if="setting.followType !== 3">댓글설정 숨기기</md-switch>
          <div class="margin-bottom-30" v-if="setting.followType !== 3 && showComment">
            <!-- <md-radio v-model="setting.commentType" :value="0">간편댓글 사용하기</md-radio> -->
            <!-- <md-radio v-model="setting.commentType" :value="1">상세댓글 사용하기</md-radio> -->
            <!-- <md-radio v-model="setting.commentType" :value="2">둘다 사용하기</md-radio> -->
            <div class="md-subheader" v-if="setting.commentType === 2"> * 간편댓글과 상세댓글을 둘다 적용하는 기능이며 상세댓글이 적용되지 않을경우 간편댓글을 적용합니다.</div>
            <div class="md-subheader" v-if="setting.commentType === 1 || setting.commentType === 2"> * 상세댓글이란 상대방 피드의 내용을 분석하여 포함하는 태그, 포함하지않는 태그(지정가능 태그갯수 무제한)를 지정하여<br> 댓글을 더 구체적으로 등록할 수 있는 기능입니다. </div>
            <div class="md-layout md-gutter" v-if="setting.commentType === 1 || setting.commentType === 2">
              <div class="md-layout-item md-size-30">
                <md-list class="md-dense">
                  <md-list-item class="md-primary" :style="{backgroundColor: '#fab1ce'}">
                    <span :style="{color: 'white'}">상세댓글 규칙</span>
                    <md-button class="md-icon-button md-list-action"></md-button>
                  </md-list-item>
                  <div v-for="(rule, index) in setting.commentRules" :key="index">
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
                <!-- <md-list class="md-dense">
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
                </md-list> -->
              </div>
            </div>

            <div class="md-subheader" v-if="setting.commentType === 0 || setting.commentType === 2"> * 간편댓글이란 상대방 피드에 올린 태그에 따라 응답할 댓글을 결정하는 기능입니다.</div>
            <div class="md-layout md-gutter" v-if="setting.commentType === 0 || setting.commentType === 2">
              <div class="md-layout-item md-size-100 md-small-size-100">
                <md-list class="md-dense">
                  <md-list-item class="md-primary" :style="{backgroundColor: '#fab1ce'}">
                    <span :style="{color: 'white'}">댓글 타겟 태그</span>
                    <md-button class="md-icon-button md-list-action"></md-button>
                  </md-list-item>
                  <div v-for="(auco, index) in setting.autoComments" :key="index">
                    <md-list-item class="md-layout" @click="selectAutoComment(auco)" :style="(auco === selectedAutoComment) ? {backgroundColor: '#e7e7e7'} : {}">
                      <div class="md-layout-item" :style="(auco.keyword === '!default') ? {color: '#448AFF'} : {}">{{auco.keyword}}</div>
                      <div class="">{{auco.comments.length}}</div>
                      <md-button class="md-icon-button md-list-action" v-if="auco.keyword !== '!default'" @click="deleteAutoComment(auco.keyword)">
                        <md-icon :style="{color: 'black'}">remove</md-icon>
                      </md-button>
                      <md-button class="md-icon-button md-list-action" v-if="auco.keyword === '!default'">
                        <md-icon :style="{color: 'red'}"></md-icon>
                      </md-button>
                    </md-list-item>
                    <md-list-item v-if="auco === selectedAutoComment">
                      <div class="md-layout-item"  v-if="selectedAutoComment">
                        <md-list class="md-dense">
                          <div>
                            <md-list-item class="md-layout">
                              <div class="md-layout-item">
                                <input type="text" v-model="comment" class="weather-input" @keyup.enter="addAutoCommentComment" placeholder="응답 댓글 (이모티콘 입력은 지원하지 않습니다.)">
                              </div>
                              <md-button class="md-icon-button md-list-action" @click="addAutoCommentComment">
                                <md-icon :style="{color: 'black'}">add</md-icon>
                              </md-button>
                            </md-list-item>
                            <md-divider></md-divider>
                          </div>
                          <div v-for="(comment, index) in selectedAutoComment.comments" :key="index">
                            <md-list-item class="md-layout">
                              <div class="md-layout-item md-layout-item-text" style="">
                                <md-icon>subdirectory_arrow_right</md-icon>
                                <span class="md-line" style="margin-top: 8px; white-space: pre-wrap;">{{comment}}</span>
                              </div>
                              <md-button class="md-icon-button md-list-action" @click="removeAutoCommentComment(comment)">
                                <md-icon :style="{color: 'black'}">remove</md-icon>
                              </md-button>
                            </md-list-item>
                            <md-divider></md-divider>
                          </div>
                        </md-list>
                      </div>
                    </md-list-item>
                    <md-divider></md-divider>
                  </div>
                  <div>
                    <md-list-item class="md-layout">
                      <div class="md-layout-item">
                        <input type="text" v-model="keyword" class="weather-input" @keyup.enter="addAutoComment" placeholder="타겟 태그">
                      </div>
                      <md-button class="md-icon-button md-list-action" @click="addAutoComment">
                        <md-icon :style="{color: 'black'}">add</md-icon>
                      </md-button>
                    </md-list-item>
                    <md-divider></md-divider>
                  </div>
                </md-list>
              </div>

              <!-- <div class="md-layout-item"  v-if="selectedAutoComment">
                <md-list class="md-dense">
                  <md-list-item class="md-primary" :style="{backgroundColor: '#fab1ce', color: 'white'}">
                    <span style="color: white; width: 100px;">응답 댓글 목록 (이모티콘 입력은 지원하지 않습니다.) </span>
                    <md-button class="md-icon-button md-list-action"></md-button>
                  </md-list-item>
                  <div v-for="(comment, index) in selectedAutoComment.comments" :key="index">
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
              </div> -->
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
                <md-checkbox v-model="setting.activeTimes" :value="0" />
                <span class="md-list-item-text">00:00 ~ 01:00</span>
              </md-list-item>

              <md-list-item>
                <md-checkbox v-model="setting.activeTimes" :value="1" />
                <span class="md-list-item-text">01:00 ~ 02:00</span>
              </md-list-item>

              <md-list-item>
                <md-checkbox v-model="setting.activeTimes" :value="2" />
                <span class="md-list-item-text">02:00 ~ 03:00</span>
              </md-list-item>

              <md-list-item>
                <md-checkbox v-model="setting.activeTimes" :value="3" />
                <span class="md-list-item-text">03:00 ~ 04:00</span>
              </md-list-item>

              <md-list-item>
                <md-checkbox v-model="setting.activeTimes" :value="4" />
                <span class="md-list-item-text">04:00 ~ 05:00</span>
              </md-list-item>

              <md-list-item>
                <md-checkbox v-model="setting.activeTimes" :value="5" />
                <span class="md-list-item-text">05:00 ~ 06:00</span>
              </md-list-item>
            </md-list>

            <md-list class="md-layout-item">
              <md-subheader>
                <md-checkbox v-model="activeTime2" @change="changeActiveTime(2)"/>
                <span class="md-list-item-text">오전</span>
              </md-subheader>
              <md-list-item>
                <md-checkbox v-model="setting.activeTimes" :value="6" />
                <span class="md-list-item-text">06:00 ~ 07:00</span>
              </md-list-item>

              <md-list-item>
                <md-checkbox v-model="setting.activeTimes" :value="7" />
                <span class="md-list-item-text">07:00 ~ 08:00</span>
              </md-list-item>

              <md-list-item>
                <md-checkbox v-model="setting.activeTimes" :value="8" />
                <span class="md-list-item-text">08:00 ~ 09:00</span>
              </md-list-item>

              <md-list-item>
                <md-checkbox v-model="setting.activeTimes" :value="9" />
                <span class="md-list-item-text">09:00 ~ 10:00</span>
              </md-list-item>

              <md-list-item>
                <md-checkbox v-model="setting.activeTimes" :value="10" />
                <span class="md-list-item-text">10:00 ~ 11:00</span>
              </md-list-item>

              <md-list-item>
                <md-checkbox v-model="setting.activeTimes" :value="11" />
                <span class="md-list-item-text">11:00 ~ 12:00</span>
              </md-list-item>
            </md-list>

            <md-list class="md-layout-item">
              <md-subheader>
                <md-checkbox v-model="activeTime3" @change="changeActiveTime(3)"/>
                <span class="md-list-item-text">오후</span>
              </md-subheader>
              <md-list-item>
                <md-checkbox v-model="setting.activeTimes" :value="12" />
                <span class="md-list-item-text">12:00 ~ 13:00</span>
              </md-list-item>

              <md-list-item>
                <md-checkbox v-model="setting.activeTimes" :value="13" />
                <span class="md-list-item-text">13:00 ~ 14:00</span>
              </md-list-item>

              <md-list-item>
                <md-checkbox v-model="setting.activeTimes" :value="14" />
                <span class="md-list-item-text">14:00 ~ 15:00</span>
              </md-list-item>

              <md-list-item>
                <md-checkbox v-model="setting.activeTimes" :value="15" />
                <span class="md-list-item-text">15:00 ~ 16:00</span>
              </md-list-item>

              <md-list-item>
                <md-checkbox v-model="setting.activeTimes" :value="16" />
                <span class="md-list-item-text">16:00 ~ 17:00</span>
              </md-list-item>

              <md-list-item>
                <md-checkbox v-model="setting.activeTimes" :value="17" />
                <span class="md-list-item-text">17:00 ~ 18:00</span>
              </md-list-item>
            </md-list>

            <md-list class="md-layout-item">
              <md-subheader>
                <md-checkbox v-model="activeTime4" @change="changeActiveTime(4)"/>
                <span class="md-list-item-text">저녁</span>
              </md-subheader>
              <md-list-item>
                <md-checkbox v-model="setting.activeTimes" :value="18" />
                <span class="md-list-item-text">18:00 ~ 19:00</span>
              </md-list-item>

              <md-list-item>
                <md-checkbox v-model="setting.activeTimes" :value="19" />
                <span class="md-list-item-text">19:00 ~ 20:00</span>
              </md-list-item>

              <md-list-item>
                <md-checkbox v-model="setting.activeTimes" :value="20" />
                <span class="md-list-item-text">20:00 ~ 21:00</span>
              </md-list-item>

              <md-list-item>
                <md-checkbox v-model="setting.activeTimes" :value="21" />
                <span class="md-list-item-text">21:00 ~ 22:00</span>
              </md-list-item>

              <md-list-item>
                <md-checkbox v-model="setting.activeTimes" :value="22" />
                <span class="md-list-item-text">22:00 ~ 23:00</span>
              </md-list-item>

              <md-list-item>
                <md-checkbox v-model="setting.activeTimes" :value="23" />
                <span class="md-list-item-text">23:00 ~ 24:00</span>
              </md-list-item>
            </md-list>
          </div>
        </main>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-accent md-raised" @click="closeDialog">취소</md-button>
        <md-button class="md-primary md-raised" @click="saveSetting">저장</md-button>
      </md-dialog-actions>
    </md-dialog>
</template>

<script>
import { setInterval, clearInterval } from 'timers';
export default {
  props: ['show', 'setting', 'size'],
  data() {
    return {
      instagramId: '',
      instagramPw: '',
      showSnackbar: false,
      showLoginDialog: false,
      snackbarMent: '',
      showDeleteButton: false,
      showSettingDialog: false,
      showTag: true,
      showActiveTime: true,
      showComment: true,
      activeTime1: false,
      activeTime2: false,
      activeTime3: false,
      activeTime4: false,
      inputTargetTag: '',
      inputTargetUser: '',
      inputBlackTag: '',
      inputBlackUser: '',
      keyword: '',
      comment: '',
      selectedAutoComment: null,
      followerOrderOptions: [
        { value: 1, text: '맞팔로우', disabled: false },
        { value: 2, text: '팔로워', disabled: false },
        { value: 3, text: '팔로잉', disabled: false },
        { value: 4, text: '시크릿팬 (상대방만 팔로우)', disabled: false },
        { value: 5, text: '스타 (나만 팔로우)', disabled: false },
      ],
      unfollowTypeOptions: [
        { value: 1, text: '맞팔제외 언팔로우' },
        { value: 2, text: '모두 언팔로우' },
      ],
    };
  },
  methods: {
    saveSetting() {
      this.$emit('save', this.setting);
    },
    closeDialog() {
      this.$emit('close');
    },
    addAutoComment() {
      if (this.keyword) {
        const result = this.setting.autoComments.filter(item => item.keyword === this.keyword)[0];
        if (!result) {
          const auco = {
            comments: [],
            id: null,
            keyword: this.keyword,
            sequence: 0,
          };
          this.setting.autoComments.push(auco);
          this.selectAutoComment(auco);
        }
      }
      this.keyword = '';
    },
    deleteAutoComment(keyword) {
      this.setting.autoComments = this.setting.autoComments.filter(item => item.keyword !== keyword);
      this.selectedAutoComments(null);
    },
    selectAutoComment(auco) {
      if (this.selectedAutoComment === auco) {
        this.selectedAutoComment = null;
      } else {
        this.selectedAutoComment = auco;
      }
    },
    addAutoCommentComment() {
      if (this.comment) {
        const result = this.selectedAutoComment.comments.filter(item => item === this.comment)[0];
        if (!result) {
          this.selectedAutoComment.comments.push(this.comment);
        }
      }
      this.comment = '';
    },
    removeAutoCommentComment(comment) {
      this.selectedAutoComment.comments = this.selectedAutoComment.comments.filter(item => item !== comment); 
    },
    addTargetTag() {
      this.inputTargetTag.split(',').forEach((item) => {
        const tag = item.trim();
        if (tag) {
          const result = this.setting.targetTags.filter(item => item === tag)[0];
          if (!result) {
            this.setting.targetTags.push(tag);
          }
        }
      });
      this.inputTargetTag = '';
    },
    addBlackTag() {
      this.inputBlackTag.split(',').forEach((item) => {
        const tag = item.trim();
        if (tag) {
          const result = this.setting.blackTags.filter(item => item === tag)[0];
          if (!result) {
            this.setting.blackTags.push(tag);
          }
        }
      });
      this.inputBlackTag = '';
    },
    addTargetUser() {
      this.inputTargetUser.split(',').forEach((item) => {
        const tag = item.trim();
        if (tag) {
          const result = this.setting.targetUsers.filter(item => item === tag)[0];
          if (!result) {
            this.setting.targetUsers.push(tag);
          }
        }
      });
      this.inputTargetUser = '';
    },
    removeTargetTag(tag) {
      this.setting.targetTags = this.setting.targetTags.filter(item => item !== tag);
    },
    removeBlackTag(tag) {
      this.setting.blackTags = this.setting.blackTags.filter(item => item !== tag);
    },
    removeTargetUser(tag) {
      this.setting.targetUsers = this.setting.targetUsers.filter(item => item !== tag);
    },
    changeActiveTime(value) {
      if (value === 1) {
        if (this.activeTime1 === false) {
          this.setting.activeTimes = this.setting.activeTimes.filter(item => item > 5);
        } else {
          const array = [0, 1, 2, 3, 4, 5];
          array.forEach((item) => {
            if (!this.setting.activeTimes.includes(item)) {
              this.setting.activeTimes.push(item);
            }
          });
        }
      } else if (value === 2) {
        if (this.activeTime2 === false) {
          this.setting.activeTimes = this.setting.activeTimes.filter(item => item <= 5 || item > 11);
        } else {
          const array = [6, 7, 8, 9, 10, 11];
          array.forEach((item) => {
            if (!this.setting.activeTimes.includes(item)) {
              this.setting.activeTimes.push(item);
            }
          });
        }
      } else if (value === 3) {
        if (this.activeTime3 === false) {
          this.setting.activeTimes = this.setting.activeTimes.filter(item => item <= 11 || item > 17);
        } else {
          const array = [12, 13, 14, 15, 16, 17];
          array.forEach((item) => {
            if (!this.setting.activeTimes.includes(item)) {
              this.setting.activeTimes.push(item);
            }
          });
        }
      } else if (value === 4) {
        if (this.activeTime4 === false) {
          this.setting.activeTimes = this.setting.activeTimes.filter(item => item < 18);
        } else {
          const array = [18, 19, 20, 21, 22, 23];
          array.forEach((item) => {
            if (!this.setting.activeTimes.includes(item)) {
              this.setting.activeTimes.push(item);
            }
          });
        }
      }
    },
  },
};
</script>

<style lang="css" scoped>
.md-radio {
  margin: 8px 8px 8px 0;
}
.weather-badge {
  background-color: #448aff; 
  color: white; 
  padding: 2px 5px 2px 5px;
  border-radius: 3px;
  margin-right: 5px;
}
.weather-log-type-selector {
  margin-left: 20px;
}
.weather-lpadding-20 {
  padding-left: 20px;
}
.md-card {
  margin-left: 0px !important;
  margin-right: 0px !important;
}
.weather-item {
  min-height: 40px;
  font-size: 13px;
  padding: 4px 16px;
}
.weather-item:hover {
  background-color: #e7e7e7;
  cursor: pointer;
}
.md-table-row {
  cursor: pointer;
}
.unfollow-item {
  background-color: rgba(255, 40, 68, 0.4);
}
.followback-item {
  background-color: rgba(38, 138, 255, 0.4);
}
.weather-instagram-proxy-item {
  padding: 10px; 
  cursor:pointer;
}
.weather-instagram-proxy-item:hover {
  background-color: #e7e7e7;
}
.w-margin-10 {
  margin-top: 10px;
  margin-bottom: 10px;
}
.weather-input {
  padding: 5px;
  width: 100%;
}
</style>
