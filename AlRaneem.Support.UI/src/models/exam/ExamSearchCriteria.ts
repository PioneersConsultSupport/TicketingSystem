import { SearchCriteriaBase } from "../SearchCriteriaBase";

export class ExamSearchCriteria extends SearchCriteriaBase {
  courseId: any | null = null;
  unitIds: string[] | null = null;
  unitId: string | null = null;
  examStatus: string | null = null;
}
