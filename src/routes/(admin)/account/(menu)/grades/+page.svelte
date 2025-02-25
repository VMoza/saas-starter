<script lang="ts">
  import { onMount } from "svelte"
  import { setContext } from "svelte"

  // Set the admin section context
  const adminSectionStore = setContext("adminSection", {
    subscribe: () => {
      return () => {}
    },
    set: (value: string) => {},
    update: () => {},
  })

  adminSectionStore.set("grades")

  // Define types for our data structure
  type Grade =
    | "A+"
    | "A"
    | "A-"
    | "B+"
    | "B"
    | "B-"
    | "C+"
    | "C"
    | "C-"
    | "D+"
    | "D"
    | "D-"
    | "F"
    | ""

  interface Class {
    id: string
    name: string
    grade: Grade
    includeInGPA: boolean
    isWeighted: boolean
  }

  interface Semester {
    id: string
    name: string
    classes: Class[]
    unweightedGPA: number
    weightedGPA: number
  }

  interface Year {
    id: string
    name: string
    semesters: Semester[]
    yearGPA: {
      unweighted: string
      weighted: string
    }
  }

  // GPA calculation constants
  const gradePoints: Record<Grade, number> = {
    "A+": 4.0,
    A: 4.0,
    "A-": 3.7,
    "B+": 3.3,
    B: 3.0,
    "B-": 2.7,
    "C+": 2.3,
    C: 2.0,
    "C-": 1.7,
    "D+": 1.3,
    D: 1.0,
    "D-": 0.7,
    F: 0.0,
    "": 0.0,
  }

  // Common class names for suggestions
  const commonClasses = [
    "English",
    "Algebra I",
    "Algebra II",
    "Geometry",
    "Pre-Calculus",
    "Calculus",
    "Biology",
    "Chemistry",
    "Physics",
    "World History",
    "U.S. History",
    "Government",
    "Economics",
    "Spanish I",
    "Spanish II",
    "French I",
    "French II",
    "Physical Education",
    "Computer Science",
    "Art",
    "Music",
  ]

  // Initialize academic years data
  let academicYears: Year[] = [
    {
      id: "year-9",
      name: "9th Grade",
      semesters: [
        {
          id: "year-9-sem-1",
          name: "Fall Semester",
          classes: generateInitialClasses("9-1"),
          unweightedGPA: 0,
          weightedGPA: 0,
        },
        {
          id: "year-9-sem-2",
          name: "Spring Semester",
          classes: generateInitialClasses("9-2"),
          unweightedGPA: 0,
          weightedGPA: 0,
        },
      ],
      yearGPA: { unweighted: "0.00", weighted: "0.00" },
    },
    {
      id: "year-10",
      name: "10th Grade",
      semesters: [
        {
          id: "year-10-sem-1",
          name: "Fall Semester",
          classes: generateInitialClasses("10-1"),
          unweightedGPA: 0,
          weightedGPA: 0,
        },
        {
          id: "year-10-sem-2",
          name: "Spring Semester",
          classes: generateInitialClasses("10-2"),
          unweightedGPA: 0,
          weightedGPA: 0,
        },
      ],
      yearGPA: { unweighted: "0.00", weighted: "0.00" },
    },
    {
      id: "year-11",
      name: "11th Grade",
      semesters: [
        {
          id: "year-11-sem-1",
          name: "Fall Semester",
          classes: generateInitialClasses("11-1"),
          unweightedGPA: 0,
          weightedGPA: 0,
        },
        {
          id: "year-11-sem-2",
          name: "Spring Semester",
          classes: generateInitialClasses("11-2"),
          unweightedGPA: 0,
          weightedGPA: 0,
        },
      ],
      yearGPA: { unweighted: "0.00", weighted: "0.00" },
    },
    {
      id: "year-12",
      name: "12th Grade",
      semesters: [
        {
          id: "year-12-sem-1",
          name: "Fall Semester",
          classes: generateInitialClasses("12-1"),
          unweightedGPA: 0,
          weightedGPA: 0,
        },
        {
          id: "year-12-sem-2",
          name: "Spring Semester",
          classes: generateInitialClasses("12-2"),
          unweightedGPA: 0,
          weightedGPA: 0,
        },
      ],
      yearGPA: { unweighted: "0.00", weighted: "0.00" },
    },
  ]

  // Generate 5 empty classes for each semester (reduced from 7)
  function generateInitialClasses(prefix: string): Class[] {
    return Array.from({ length: 5 }, (_, i) => ({
      id: `${prefix}-class-${i + 1}`,
      name: "",
      grade: "" as Grade,
      includeInGPA: true,
      isWeighted: false,
    }))
  }

  // Calculate GPA for a semester
  function calculateSemesterGPA(semester: Semester) {
    const includedClasses = semester.classes.filter(
      (c) => c.includeInGPA && c.name && c.grade,
    )

    if (includedClasses.length === 0) {
      semester.unweightedGPA = 0
      semester.weightedGPA = 0
      return
    }

    // Calculate unweighted GPA
    const totalUnweightedPoints = includedClasses.reduce(
      (sum, c) => sum + gradePoints[c.grade],
      0,
    )
    semester.unweightedGPA = totalUnweightedPoints / includedClasses.length

    // Calculate weighted GPA
    const totalWeightedPoints = includedClasses.reduce((sum, c) => {
      const points = gradePoints[c.grade]
      return sum + (c.isWeighted ? points + 1.0 : points)
    }, 0)
    semester.weightedGPA = totalWeightedPoints / includedClasses.length
  }

  // Calculate year GPA
  function calculateYearGPA(year: Year) {
    let totalUnweightedPoints = 0
    let totalWeightedPoints = 0
    let totalClasses = 0

    year.semesters.forEach((semester) => {
      const includedClasses = semester.classes.filter(
        (c) => c.includeInGPA && c.name && c.grade,
      )
      totalClasses += includedClasses.length
      totalUnweightedPoints += includedClasses.reduce(
        (sum, c) => sum + gradePoints[c.grade],
        0,
      )
      totalWeightedPoints += includedClasses.reduce((sum, c) => {
        const points = gradePoints[c.grade]
        return sum + (c.isWeighted ? points + 1.0 : points)
      }, 0)
    })

    year.yearGPA = {
      unweighted:
        totalClasses > 0
          ? (totalUnweightedPoints / totalClasses).toFixed(2)
          : "0.00",
      weighted:
        totalClasses > 0
          ? (totalWeightedPoints / totalClasses).toFixed(2)
          : "0.00",
    }
  }

  // Calculate GPA for all semesters and years
  function calculateAllGPAs() {
    academicYears.forEach((year) => {
      year.semesters.forEach((semester) => {
        calculateSemesterGPA(semester)
      })
      calculateYearGPA(year)
    })
    academicYears = [...academicYears] // Trigger reactivity
  }

  // Add a new class to a semester
  function addClass(semesterId: string) {
    const yearIndex = academicYears.findIndex((y) =>
      y.semesters.some((s) => s.id === semesterId),
    )

    if (yearIndex === -1) return

    const semesterIndex = academicYears[yearIndex].semesters.findIndex(
      (s) => s.id === semesterId,
    )

    const newClass: Class = {
      id: `${semesterId}-class-${
        academicYears[yearIndex].semesters[semesterIndex].classes.length + 1
      }`,
      name: "",
      grade: "" as Grade,
      includeInGPA: true,
      isWeighted: false,
    }

    academicYears[yearIndex].semesters[semesterIndex].classes.push(newClass)
    academicYears = [...academicYears] // Trigger reactivity
    calculateAllGPAs()
  }

  // Remove a class from a semester
  function removeClass(semesterId: string, classId: string) {
    const yearIndex = academicYears.findIndex((y) =>
      y.semesters.some((s) => s.id === semesterId),
    )

    if (yearIndex === -1) return

    const semesterIndex = academicYears[yearIndex].semesters.findIndex(
      (s) => s.id === semesterId,
    )

    academicYears[yearIndex].semesters[semesterIndex].classes = academicYears[
      yearIndex
    ].semesters[semesterIndex].classes.filter((c) => c.id !== classId)

    academicYears = [...academicYears] // Trigger reactivity
    calculateAllGPAs()
  }

  // Toggle include in GPA
  function toggleIncludeInGPA(semesterId: string, classId: string) {
    const yearIndex = academicYears.findIndex((y) =>
      y.semesters.some((s) => s.id === semesterId),
    )

    if (yearIndex === -1) return

    const semesterIndex = academicYears[yearIndex].semesters.findIndex(
      (s) => s.id === semesterId,
    )
    const classIndex = academicYears[yearIndex].semesters[
      semesterIndex
    ].classes.findIndex((c) => c.id === classId)

    if (classIndex === -1) return

    academicYears[yearIndex].semesters[semesterIndex].classes[
      classIndex
    ].includeInGPA =
      !academicYears[yearIndex].semesters[semesterIndex].classes[classIndex]
        .includeInGPA

    academicYears = [...academicYears] // Trigger reactivity
    calculateAllGPAs()
  }

  // Toggle weighted class
  function toggleWeighted(semesterId: string, classId: string) {
    const yearIndex = academicYears.findIndex((y) =>
      y.semesters.some((s) => s.id === semesterId),
    )

    if (yearIndex === -1) return

    const semesterIndex = academicYears[yearIndex].semesters.findIndex(
      (s) => s.id === semesterId,
    )
    const classIndex = academicYears[yearIndex].semesters[
      semesterIndex
    ].classes.findIndex((c) => c.id === classId)

    if (classIndex === -1) return

    academicYears[yearIndex].semesters[semesterIndex].classes[
      classIndex
    ].isWeighted =
      !academicYears[yearIndex].semesters[semesterIndex].classes[classIndex]
        .isWeighted

    academicYears = [...academicYears] // Trigger reactivity
    calculateAllGPAs()
  }

  // Update class name
  function updateClassName(semesterId: string, classId: string, name: string) {
    const yearIndex = academicYears.findIndex((y) =>
      y.semesters.some((s) => s.id === semesterId),
    )

    if (yearIndex === -1) return

    const semesterIndex = academicYears[yearIndex].semesters.findIndex(
      (s) => s.id === semesterId,
    )
    const classIndex = academicYears[yearIndex].semesters[
      semesterIndex
    ].classes.findIndex((c) => c.id === classId)

    if (classIndex === -1) return

    academicYears[yearIndex].semesters[semesterIndex].classes[classIndex].name =
      name
    calculateAllGPAs()
  }

  // Update class grade
  function updateClassGrade(semesterId: string, classId: string, grade: Grade) {
    const yearIndex = academicYears.findIndex((y) =>
      y.semesters.some((s) => s.id === semesterId),
    )

    if (yearIndex === -1) return

    const semesterIndex = academicYears[yearIndex].semesters.findIndex(
      (s) => s.id === semesterId,
    )
    const classIndex = academicYears[yearIndex].semesters[
      semesterIndex
    ].classes.findIndex((c) => c.id === classId)

    if (classIndex === -1) return

    academicYears[yearIndex].semesters[semesterIndex].classes[
      classIndex
    ].grade = grade
    calculateAllGPAs()
  }

  // Copy classes from Fall to Spring semester
  function copyClassesToSpring(yearId: string) {
    const yearIndex = academicYears.findIndex((y) => y.id === yearId)
    if (yearIndex === -1) return

    const fallSemester = academicYears[yearIndex].semesters[0]
    const springSemester = academicYears[yearIndex].semesters[1]

    // Create deep copies of the classes
    const copiedClasses = fallSemester.classes.map((cls) => {
      return {
        ...cls,
        id: cls.id.replace("-sem-1", "-sem-2"),
        grade: "" as Grade, // Reset grades for the new semester
      }
    })

    // Replace spring semester classes with copied ones
    academicYears[yearIndex].semesters[1].classes = copiedClasses
    academicYears = [...academicYears] // Trigger reactivity
    calculateAllGPAs()
  }

  // Calculate cumulative GPA
  function calculateCumulativeGPA() {
    let totalUnweightedPoints = 0
    let totalWeightedPoints = 0
    let totalClasses = 0

    academicYears.forEach((year) => {
      year.semesters.forEach((semester) => {
        const includedClasses = semester.classes.filter(
          (c) => c.includeInGPA && c.name && c.grade,
        )

        totalClasses += includedClasses.length

        totalUnweightedPoints += includedClasses.reduce(
          (sum, c) => sum + gradePoints[c.grade],
          0,
        )

        totalWeightedPoints += includedClasses.reduce((sum, c) => {
          const points = gradePoints[c.grade]
          return sum + (c.isWeighted ? points + 1.0 : points)
        }, 0)
      })
    })

    return {
      unweighted:
        totalClasses > 0
          ? (totalUnweightedPoints / totalClasses).toFixed(2)
          : "0.00",
      weighted:
        totalClasses > 0
          ? (totalWeightedPoints / totalClasses).toFixed(2)
          : "0.00",
    }
  }

  // Calculate on mount and when data changes
  onMount(() => {
    calculateAllGPAs()
  })

  // Track expanded/collapsed state for each year
  let expandedYears: Record<string, boolean> = {
    "year-9": true,
    "year-10": false,
    "year-11": false,
    "year-12": false,
  }

  function toggleYearExpansion(yearId: string) {
    expandedYears[yearId] = !expandedYears[yearId]
    expandedYears = { ...expandedYears } // Trigger reactivity
  }

  // Save data to localStorage
  function saveData() {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("academicYears", JSON.stringify(academicYears))
      showSaveSuccess = true
      setTimeout(() => {
        showSaveSuccess = false
      }, 3000)
    }
  }

  // Load data from localStorage
  function loadData() {
    if (typeof localStorage !== "undefined") {
      const savedData = localStorage.getItem("academicYears")
      if (savedData) {
        academicYears = JSON.parse(savedData)
        calculateAllGPAs()
      }
    }
  }

  let showSaveSuccess = false

  // Load saved data on mount
  onMount(() => {
    loadData()
  })
</script>

<div class="py-6">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">Academic Information</h1>
    <div class="flex gap-2">
      <button class="btn btn-primary" on:click={saveData}>
        Save Information
      </button>
      {#if showSaveSuccess}
        <div class="alert alert-success shadow-lg">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              /></svg
            >
            <span>Information saved successfully!</span>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <div class="card bg-base-100 shadow-xl mb-8">
    <div class="card-body">
      <h2 class="card-title text-2xl">Cumulative GPA</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div class="border border-primary rounded-lg p-4 bg-base-100">
          <div class="text-lg font-medium">Unweighted GPA</div>
          <div class="text-3xl font-bold text-primary">
            {calculateCumulativeGPA().unweighted}
          </div>
          <div class="text-sm opacity-70">4.0 Scale</div>
        </div>
        <div class="border border-secondary rounded-lg p-4 bg-base-100">
          <div class="text-lg font-medium">Weighted GPA</div>
          <div class="text-3xl font-bold text-secondary">
            {calculateCumulativeGPA().weighted}
          </div>
          <div class="text-sm opacity-70">5.0 Scale for Weighted Classes</div>
        </div>
      </div>
    </div>
  </div>

  <div class="space-y-6">
    {#each academicYears as year (year.id)}
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <div
            class="flex justify-between items-center cursor-pointer"
            on:click={() => toggleYearExpansion(year.id)}
          >
            <div class="flex items-center gap-4">
              <h2 class="card-title text-xl">{year.name}</h2>
              <div class="border border-primary rounded-lg px-3 py-1 text-sm">
                Unweighted: {year.yearGPA.unweighted}
              </div>
              <div class="border border-secondary rounded-lg px-3 py-1 text-sm">
                Weighted: {year.yearGPA.weighted}
              </div>
            </div>
            <button class="btn btn-sm btn-circle">
              {#if expandedYears[year.id]}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              {:else}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              {/if}
            </button>
          </div>

          {#if expandedYears[year.id]}
            <div class="mt-4">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {#each year.semesters as semester, semesterIndex (semester.id)}
                  <div class="border border-base-300 rounded-lg p-4">
                    <div class="flex justify-between items-center mb-4">
                      <h3 class="text-lg font-semibold">{semester.name}</h3>
                      {#if semesterIndex === 1}
                        <button
                          class="btn btn-sm btn-outline"
                          on:click={() => copyClassesToSpring(year.id)}
                          title="Copy classes from Fall semester"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          Copy from Fall
                        </button>
                      {/if}
                    </div>

                    <div class="overflow-x-auto">
                      <table class="table w-full">
                        <thead>
                          <tr>
                            <th class="w-1/3">Class Name</th>
                            <th class="w-1/5">Grade</th>
                            <th class="w-1/6 text-center">
                              <div
                                class="tooltip"
                                data-tip="Include in GPA calculation"
                              >
                                In GPA
                              </div>
                            </th>
                            <th class="w-1/6 text-center">
                              <div
                                class="tooltip"
                                data-tip="Mark as weighted (AP/Honors)"
                              >
                                Weighted
                              </div>
                            </th>
                            <th class="w-12"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {#each semester.classes as classItem (classItem.id)}
                            <tr>
                              <td>
                                <input
                                  type="text"
                                  class="input input-bordered w-full"
                                  placeholder="Class Name"
                                  value={classItem.name}
                                  list="common-classes"
                                  on:input={(e) =>
                                    updateClassName(
                                      semester.id,
                                      classItem.id,
                                      e.currentTarget.value,
                                    )}
                                />
                              </td>
                              <td>
                                <select
                                  class="select select-bordered w-full min-w-[100px]"
                                  value={classItem.grade}
                                  on:change={(e) =>
                                    updateClassGrade(
                                      semester.id,
                                      classItem.id,
                                      e.currentTarget.value as Grade,
                                    )}
                                >
                                  <option value="">Grade</option>
                                  <option value="A+">A+</option>
                                  <option value="A">A</option>
                                  <option value="A-">A-</option>
                                  <option value="B+">B+</option>
                                  <option value="B">B</option>
                                  <option value="B-">B-</option>
                                  <option value="C+">C+</option>
                                  <option value="C">C</option>
                                  <option value="C-">C-</option>
                                  <option value="D+">D+</option>
                                  <option value="D">D</option>
                                  <option value="D-">D-</option>
                                  <option value="F">F</option>
                                </select>
                              </td>
                              <td class="text-center">
                                <input
                                  type="checkbox"
                                  class="toggle toggle-primary"
                                  checked={classItem.includeInGPA}
                                  on:change={() =>
                                    toggleIncludeInGPA(
                                      semester.id,
                                      classItem.id,
                                    )}
                                />
                              </td>
                              <td class="text-center">
                                <input
                                  type="checkbox"
                                  class="toggle toggle-secondary"
                                  checked={classItem.isWeighted}
                                  on:change={() =>
                                    toggleWeighted(semester.id, classItem.id)}
                                />
                              </td>
                              <td>
                                <button
                                  class="btn btn-sm btn-ghost btn-circle"
                                  on:click={() =>
                                    removeClass(semester.id, classItem.id)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-4 w-4 text-error"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          {/each}
                        </tbody>
                      </table>
                    </div>

                    <div class="flex justify-between mt-4">
                      <button
                        class="btn btn-sm btn-outline"
                        on:click={() => addClass(semester.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Add Class
                      </button>

                      <div class="flex gap-2">
                        <div
                          class="border border-primary rounded-lg px-3 py-1 text-sm"
                        >
                          Unweighted: {semester.unweightedGPA.toFixed(2)}
                        </div>
                        <div
                          class="border border-secondary rounded-lg px-3 py-1 text-sm"
                        >
                          Weighted: {semester.weightedGPA.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>

<datalist id="common-classes">
  {#each commonClasses as className}
    <option value={className} />
  {/each}
</datalist>
