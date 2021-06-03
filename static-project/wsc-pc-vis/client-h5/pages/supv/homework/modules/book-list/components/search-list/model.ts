import { computed, ref, Ref, watch, ComputedRef, nextTick, onUpdated } from '@youzan/tany-vue';
import { createWorkbookListApi } from 'domain/supv/homework/services/workbook';
import { debounce } from 'lodash';
import Vue from 'vue';
export type ISearchContentType = {
    title: string,
    id: number
}

export interface ISearchListModel {
    loading: Ref<boolean>,
    page: Ref<number>,
    keyword: Ref<string>,
    placeholder: string,
    isFocus: Ref<boolean>,
    fieldRef: Ref<null>,
    isShowPlaceholder: ComputedRef<boolean>,
    isInitLoading: ComputedRef<boolean>,
    searchHasNext: Ref<boolean>,
    searchContent: Ref<Array<ISearchContentType>>,
    setFocus: (val: boolean) => void,
    setKeyword: (val: string) => void,
    handleSearchList: Function,
    handleNextSearchList: Function,
}

function SearchListModel(): ISearchListModel {
    const page = ref(1)
    const pageSize = 20
    const placeholder = '搜索作业本'
    const isFocus = ref(false)
    const fieldRef = ref(null)
    const keyword = ref('')
    const loading = ref(true)
    const searchContent = ref<Array<ISearchContentType>>([])
    const searchHasNext = ref(true)
    const isShowPlaceholder = computed(() => !isFocus.value && keyword.value.length === 0)
    const isInitLoading = computed(() => loading.value && searchContent.value.length === 0 || false);
    const debounceSearchList = debounce((page) => {
        setPage(page)
        handleSearchList()
    }, 200)
    const isListStatic = computed(() => isFocus.value || keyword.value.length > 0)
    watch(isListStatic, () => {
        document.body.style.position = isListStatic.value ? 'fixed' : 'static'
    })
    watch(isFocus, () => {
        if (!fieldRef) return
        Vue.nextTick(() => {
            // @ts-ignore
            isFocus.value ? fieldRef.value.focus() : fieldRef.value.blur()
        })
    })

    async function handleSearchList() {
        const title = keyword.value
        const newPage = page.value
        const searchListApi = createWorkbookListApi({ title });
        setLoading(true)
        searchListApi({ page: newPage, pageSize, errorText: '查询作业本列表失败' }).then((res) => {
            if (res) {
                const { list, totalPages } = res
                setSearchContent(list)
                searchHasNext.value = newPage < totalPages
            }
        }).finally(() => setLoading(false))
    }
    function handleNextSearchList() {
        debounceSearchList(page.value + 1)
    }
    function setSearchContent(val: Array<ISearchContentType>) {
        if (page.value === 1) {
            searchContent.value = val
        } else {
            searchContent.value = [...searchContent.value, ...val]
        }
    }
    function setPage(newPage: number) {
        page.value = newPage
    }
    function setLoading(status: boolean) {
        loading.value = status
    }
    async function setFocus(val: boolean) {
        isFocus.value = val
        // ios要触发两次
        // @ts-ignore
        isFocus.value ? (fieldRef && fieldRef.value.focus()) : (fieldRef && fieldRef.value.blur())
    }
    function setKeyword(val: string) {
        keyword.value = val
        Vue.nextTick(() => {
            // @ts-ignore
            !val && isFocus.value && fieldRef && fieldRef.value.focus()
        })
        if (isFocus.value && val) {
            debounceSearchList(1)
        } else {
            setSearchContent([])
        }
    }
    return {
        loading,
        page,
        fieldRef,
        placeholder,
        isFocus,
        keyword,
        isShowPlaceholder,
        isInitLoading,
        searchContent,
        searchHasNext,
        setFocus,
        setKeyword,
        handleSearchList,
        handleNextSearchList
    }
}

export default SearchListModel